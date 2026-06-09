'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import WizardShell from '@/features/projects/components/wizard-shell';
import WizardIntro from '@/features/projects/components/wizard-intro';
import WizardNameStep from '@/features/projects/components/wizard-name-step';
import WizardColorPicker from '@/features/projects/components/wizard-color-picker';
import { useLeadProjectWizard } from '../hooks/use-lead-project-wizard';
import ApiQuestionStep from './api-question-step';
import LeadProjectAuthGate from './lead-project-auth-gate';
import LeadProjectReview from './lead-project-review';

interface LeadProjectWizardProps {
  onClose: () => void;
  onComplete: (requestId?: string) => void;
  isLeadMode?: boolean;
}

export default function LeadProjectWizard({
  onClose,
  onComplete,
  isLeadMode = false,
}: LeadProjectWizardProps) {
  const wizard = useLeadProjectWizard({ onComplete });

  const {
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
  } = wizard;

  const renderStepContent = () => {
    if (step === authStep && !isAuthenticated) {
      return <LeadProjectAuthGate onAuthenticated={handleAuthenticated} submitError={errors[0]} />;
    }

    if (questionsLoading && step > 0 && step <= questionCount) {
      return (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      );
    }

    if (questionsError && step > 0 && step <= questionCount) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-red-400">{questionsError}</p>
        </div>
      );
    }

    if (step === 0) {
      return <WizardIntro t={t} onStart={nextStep} />;
    }

    if (currentQuestion) {
      return (
        <ApiQuestionStep
          question={currentQuestion}
          answer={answersByQuestionId[currentQuestion.id]}
          onSelectSingle={(optionId) => selectSingleAnswerAndContinue(currentQuestion.id, optionId)}
          onTextChange={(value) => setTextAnswer(currentQuestion.id, value)}
        />
      );
    }

    if (step === nameStep) {
      return <WizardNameStep name={name} t={t} onChange={setName} />;
    }

    if (step === colorStep) {
      return (
        <WizardColorPicker
          presetColors={presetColors}
          brandColor={brandColor}
          showCustomColor={showCustomColor}
          t={t}
          onSelectPreset={(hex) => {
            setBrandColor(hex);
            setShowCustomColor(false);
          }}
          onToggleCustom={() => setShowCustomColor(!showCustomColor)}
          onChangeCustom={setBrandColor}
        />
      );
    }

    if (step === reviewStep) {
      return (
        <LeadProjectReview
          questions={questions}
          name={name}
          brandColor={brandColor}
          answersByQuestionId={answersByQuestionId}
          getAnswerLabel={getAnswerLabel}
          t={t}
        />
      );
    }

    return null;
  };

  const isAuthStep = step === authStep && !isAuthenticated;
  const shellStep = step;
  const shellTotalSteps = Math.max(totalSteps, questionCount + (isAuthenticated ? 4 : 5));
  const isReviewStep = step === reviewStep;
  const showFooter = !isAuthStep && step !== 0;

  return (
    <WizardShell
      step={shellStep}
      direction={direction}
      totalSteps={shellTotalSteps}
      isLoading={isLoading}
      errors={errors}
      nextButtonHidden={isNextHidden()}
      isLeadMode={isLeadMode}
      isAuthenticated={isAuthenticated}
      dir={dir}
      language={language}
      setLanguage={setLanguage}
      t={t}
      onClose={onClose}
      onPrev={prevStep}
      onNext={isReviewStep && isAuthenticated ? handleSubmit : nextStep}
      customFooterLabel={
        isReviewStep
          ? !isAuthenticated
            ? t('auth.continue')
            : isLeadMode
            ? t('lead_contact.submit_btn')
            : t('wizard.create_btn')
          : undefined
      }
      showFooter={showFooter}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{
            x: direction > 0 ? (dir === 'rtl' ? -300 : 300) : dir === 'rtl' ? 300 : -300,
            opacity: 0,
          }}
          animate={{ x: 0, opacity: 1 }}
          exit={{
            x: direction > 0 ? (dir === 'rtl' ? 300 : -300) : dir === 'rtl' ? -300 : 300,
            opacity: 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0 h-full w-full"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </WizardShell>
  );
}
