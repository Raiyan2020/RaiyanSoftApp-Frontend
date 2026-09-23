'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  const { t, dir, language } = useTranslation();
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
  // Set while the client edits one answer from the review screen: holds the
  // values as they were, so "back" can discard the edit. The primary action
  // validates the step and returns straight to review instead of walking
  // forward through every following step.
  const [editSnapshot, setEditSnapshot] = useState<{
    name: string;
    brandColor: string;
    showCustomColor: boolean;
    answersByQuestionId: Record<number, number | string>;
  } | null>(null);
  const isEditingFromReview = editSnapshot !== null;

  const { questions, loading: questionsLoading, error: questionsError } = useFormQuestions(
    language,
    questionsEnabled
  );

  const [colorsInitialized, setColorsInitialized] = useState(false);
  const [reviewedQuestionsKey, setReviewedQuestionsKey] = useState(savedDraft.reviewedQuestionsKey);
  const submittingRef = useRef(false);

  // Initialize the brand color once the preset colors have loaded, adjusted
  // during render instead of in an effect (guarded by colorsInitialized so
  // it only runs once).
  if (!colorsInitialized && presetColors.length) {
    if (!brandColor) setBrandColor(presetColors[0].hex);
    setColorsInitialized(true);
  }

  useEffect(() => {
    saveLeadProjectDraft({
      step,
      name,
      brandColor,
      showCustomColor,
      answersByQuestionId,
      reviewedQuestionsKey,
    });
  }, [answersByQuestionId, brandColor, name, showCustomColor, step, reviewedQuestionsKey]);

  const questionCount = questions.length;
  const nameStep = questionCount + 1;
  const colorStep = questionCount + 2;
  const reviewStep = questionCount + 3;

  // "Completed once" is tied to the exact question list: if the form's
  // questions change, the shortcut hides until review is reached again.
  const questionsKey = questions.map((question) => question.id).join(',');
  const hasReachedReview = questionCount > 0 && reviewedQuestionsKey === questionsKey;
  if (step === reviewStep && questionCount > 0 && !questionsLoading && !hasReachedReview) {
    setReviewedQuestionsKey(questionsKey);
  }
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
    if (isEditingFromReview) {
      returnToReview();
      return;
    }
    setDirection(1);
    setStep((current) => {
      const question = questions[current - 1];
      if (!question || question.id !== questionId) return current;
      return Math.min(current + 1, reviewStep);
    });
  };

  const returnToReview = () => {
    setEditSnapshot(null);
    setErrors([]);
    setDirection(1);
    setStep(reviewStep);
  };

  // Jump from the review screen to the step that owns one answer.
  const goToStepFromReview = (targetStep: number) => {
    setErrors([]);
    setEditSnapshot({ name, brandColor, showCustomColor, answersByQuestionId });
    setDirection(-1);
    setStep(targetStep);
  };

  const setTextAnswer = (questionId: number, value: string) => {
    setAnswersByQuestionId((current) => ({ ...current, [questionId]: value }));
  };

  const getStepErrors = (currentStep: number): string[] => {
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

    return newErrors;
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors = getStepErrors(currentStep);
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Shortcut for a client who already completed the form once and walked
  // back: validate this step, then jump to review, or to the first step that
  // is no longer valid.
  const jumpToReview = () => {
    if (!validateStep(step)) return;
    let target = reviewStep;
    for (let candidate = 1; candidate <= colorStep; candidate += 1) {
      if (getStepErrors(candidate).length > 0) {
        target = candidate;
        break;
      }
    }
    setErrors(target === reviewStep ? [] : getStepErrors(target));
    setDirection(1);
    setStep(target);
  };

  const canJumpToReview =
    hasReachedReview && !isEditingFromReview && step >= 1 && step <= colorStep;

  const nextStep = () => {
    if (!validateStep(step)) return;
    if (isEditingFromReview) {
      returnToReview();
      return;
    }
    setDirection(1);
    setStep((current) => Math.min(current + 1, isAuthenticated ? reviewStep : authStep));
  };

  const prevStep = () => {
    if (editSnapshot) {
      // Back while editing from review = cancel: restore the previous values.
      setName(editSnapshot.name);
      setBrandColor(editSnapshot.brandColor);
      setShowCustomColor(editSnapshot.showCustomColor);
      setAnswersByQuestionId(editSnapshot.answersByQuestionId);
      returnToReview();
      return;
    }
    setErrors([]);
    setDirection(-1);
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async () => {
    if (submittingRef.current) return;
    if (!validateStep(reviewStep)) return;

    submittingRef.current = true;
    setIsLoading(true);
    setErrors([]);

    try {
      const response = await storeProject({
        name: name.trim(),
        color: brandColor,
        // Only answers to questions still in the form; drops leftovers from
        // questions removed since the draft was saved. Skipped if the
        // question list failed to load, so answers are never all dropped.
        answersByQuestionId: questions.length
          ? Object.fromEntries(
              questions
                .filter((question) => answersByQuestionId[question.id] !== undefined)
                .map((question) => [question.id, answersByQuestionId[question.id]])
            )
          : answersByQuestionId,
      });

      if (!response.status) {
        throw new Error(getApiErrorMessage(response));
      }

      const data = response.data as { request_id?: string } | [];
      const requestId = Array.isArray(data) ? undefined : data?.request_id;
      await queryClient.invalidateQueries({ queryKey: leadProjectKeys.all });
      globalToast.success(response.message || 'Lead created successfully.');
      clearLeadProjectDraft();
      onComplete(requestId);
    } catch (err: any) {
      setErrors([err.message || (dir === 'rtl' ? 'فشل إرسال الطلب.' : 'Failed to submit request.')]);
    } finally {
      submittingRef.current = false;
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
    goToStepFromReview,
    isEditingFromReview,
    canJumpToReview,
    jumpToReview,
    handleSubmit,
    selectSingleAnswerAndContinue,
    setTextAnswer,
    handleAuthenticated,
    isNextHidden,
    getAnswerLabel,
    t,
    dir,
    language,
    clearDraft: clearLeadProjectDraft,
  };
}
