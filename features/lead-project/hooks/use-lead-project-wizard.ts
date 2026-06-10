'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth-service';
import {
  clearLeadProjectDraft,
  loadLeadProjectDraft,
  saveLeadProjectDraft,
} from '@/lib/leadProjectDraftStore';
import { useTranslation } from '@/lib/i18nContext';
import { globalToast } from '@/lib/toast-context';
import { useUserColors, mapUserColorsToPresetOptions, FALLBACK_PRESET_COLORS } from '@/features/colors';
import { getApiErrorMessage, storeProject } from '../services/lead-project-api';
import { leadProjectKeys } from '../query-keys';
import { FormQuestion } from '../types/form-question.types';
import { isQuestionAnswered, resolveQuestionType } from '../utils/question-helpers';
import { useFormQuestions } from './use-form-questions';

export function useLeadProjectWizard({
  onComplete,
  questionsEnabled = true,
}: {
  onComplete: (requestId?: string) => void;
  questionsEnabled?: boolean;
}) {
  const { t, dir, language, setLanguage } = useTranslation();
  const queryClient = useQueryClient();
  const { colors } = useUserColors();
  const presetColors = useMemo(
    () => mapUserColorsToPresetOptions(colors),
    [colors]
  );
  const isAuthenticated = Boolean(authService.getUserToken());
  const savedDraft = useMemo(() => loadLeadProjectDraft(), []);
  const [step, setStep] = useState(savedDraft.step || 0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState(savedDraft.name || '');
  const [brandColor, setBrandColor] = useState(savedDraft.brandColor || FALLBACK_PRESET_COLORS[0].hex);
  const [showCustomColor, setShowCustomColor] = useState(savedDraft.showCustomColor || false);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<
    Record<number, number | string>
  >(savedDraft.answersByQuestionId || {});
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { questions, loading: questionsLoading, error: questionsError } = useFormQuestions(
    language,
    questionsEnabled
  );

  const [colorsInitialized, setColorsInitialized] = useState(false);

  useEffect(() => {
    if (colorsInitialized || !presetColors.length) return;
    if (!brandColor) setBrandColor(presetColors[0].hex);
    setColorsInitialized(true);
  }, [brandColor, colorsInitialized, presetColors]);

  useEffect(() => {
    saveLeadProjectDraft({
      step,
      name,
      brandColor,
      showCustomColor,
      answersByQuestionId,
    });
  }, [answersByQuestionId, brandColor, name, showCustomColor, step]);

  const questionCount = questions.length;
  const nameStep = questionCount + 1;
  const colorStep = questionCount + 2;
  const reviewStep = questionCount + 3;
  const authStep = questionCount + 4;
  const totalSteps = (isAuthenticated ? reviewStep : authStep) + 1;

  const currentQuestion = useMemo(() => {
    if (step < 1 || step > questionCount) return null;
    return questions[step - 1] ?? null;
  }, [step, questionCount, questions]);

  const handleAuthenticated = async () => {
    await handleSubmit();
  };

  const selectSingleAnswerAndContinue = (questionId: number, optionId: number) => {
    setErrors([]);
    setAnswersByQuestionId((current) => ({ ...current, [questionId]: optionId }));
    setDirection(1);
    setStep((current) => {
      const question = questions[current - 1];
      if (!question || question.id !== questionId) return current;
      return Math.min(current + 1, reviewStep);
    });
  };

  const setTextAnswer = (questionId: number, value: string) => {
    setAnswersByQuestionId((current) => ({ ...current, [questionId]: value }));
  };

  const validateStep = (currentStep: number): boolean => {
    setErrors([]);
    const newErrors: string[] = [];

    if (currentStep >= 1 && currentStep <= questionCount) {
      const question = questions[currentStep - 1];
      if (question && !isQuestionAnswered(question, answersByQuestionId)) {
        newErrors.push(dir === 'rtl' ? 'يرجى اختيار إجابة.' : 'Please select an answer.');
      }
    }

    if (currentStep === nameStep) {
      if (name.trim().length < 3) {
        newErrors.push(t('val.req_name'));
      }
    }

    if (currentStep === colorStep) {
      if (!brandColor.trim()) {
        newErrors.push(t('val.req_color'));
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    setDirection(1);
    setStep((current) => Math.min(current + 1, isAuthenticated ? reviewStep : authStep));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(reviewStep)) return;

    setIsLoading(true);
    setErrors([]);

    try {
      const response = await storeProject({
        name: name.trim(),
        color: brandColor,
        answersByQuestionId,
      });

      if (!response.status) {
        throw new Error(getApiErrorMessage(response));
      }

      const data = response.data as { request_id?: string } | [];
      const requestId = Array.isArray(data) ? undefined : data?.request_id;
      await queryClient.invalidateQueries({ queryKey: leadProjectKeys.all });
      globalToast.success(response.message || (dir === 'rtl' ? 'تم إنشاء الطلب بنجاح.' : 'Lead created successfully.'));
      clearLeadProjectDraft();
      onComplete(requestId);
    } catch (err: any) {
      setErrors([err.message || (dir === 'rtl' ? 'فشل إرسال الطلب.' : 'Failed to submit request.')]);
    } finally {
      setIsLoading(false);
    }
  };

  const isNextHidden = () => {
    if (step === 0) return true;
    if (step === authStep && !isAuthenticated) return true;
    if (step === reviewStep) return false;
    return false;
  };

  const getAnswerLabel = (question: FormQuestion, answer: number | string) => {
    const type = resolveQuestionType(question);

    if (type === 'text' && typeof answer === 'string') return answer;

    if (typeof answer === 'number') {
      return question.options.find((option) => option.id === answer)?.value || String(answer);
    }

    return '';
  };

  return {
    step,
    direction,
    totalSteps,
    questionCount,
    nameStep,
    colorStep,
    reviewStep,
    authStep,
    questions,
    currentQuestion,
    questionsLoading,
    questionsError,
    isAuthenticated,
    name,
    setName,
    presetColors,
    brandColor,
    setBrandColor,
    showCustomColor,
    setShowCustomColor,
    answersByQuestionId,
    errors,
    isLoading,
    nextStep,
    prevStep,
    handleSubmit,
    selectSingleAnswerAndContinue,
    setTextAnswer,
    handleAuthenticated,
    isNextHidden,
    getAnswerLabel,
    t,
    dir,
    language,
    setLanguage,
    clearDraft: clearLeadProjectDraft,
  };
}
