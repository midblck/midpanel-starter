'use client'

import { useMemo } from 'react'

import { useLocale } from 'next-intl'

import { commentsBlockTranslations, type Locale } from './index'

/**
 * Hook to get translated strings for comments block
 * @returns Object with translated strings based on current locale
 */
export const useCommentsBlockTranslations = () => {
  const locale = useLocale()

  return useMemo(() => {
    const currentLocale = (locale as Locale) || 'en'

    return {
      addComment: commentsBlockTranslations.addComment[currentLocale],
      comment: commentsBlockTranslations.comment[currentLocale],
      commentMaxLength: commentsBlockTranslations.commentMaxLength[currentLocale],
      commentMinLength: commentsBlockTranslations.commentMinLength[currentLocale],
      commentRequired: commentsBlockTranslations.commentRequired[currentLocale],
      comments: commentsBlockTranslations.comments[currentLocale],
      commentSubmitted: commentsBlockTranslations.commentSubmitted[currentLocale],
      email: commentsBlockTranslations.email[currentLocale],
      emailMaxLength: commentsBlockTranslations.emailMaxLength[currentLocale],
      emailRequired: commentsBlockTranslations.emailRequired[currentLocale],
      enterYourEmail: commentsBlockTranslations.enterYourEmail[currentLocale],
      enterYourName: commentsBlockTranslations.enterYourName[currentLocale],
      gotoAdminAndPublish: commentsBlockTranslations.gotoAdminAndPublish[currentLocale],
      invalidEmail: commentsBlockTranslations.invalidEmail[currentLocale],
      name: commentsBlockTranslations.name[currentLocale],
      nameMaxLength: commentsBlockTranslations.nameMaxLength[currentLocale],
      nameMinLength: commentsBlockTranslations.nameMinLength[currentLocale],
      nameRequired: commentsBlockTranslations.nameRequired[currentLocale],
      process: commentsBlockTranslations.process[currentLocale],
      shareThoughts: commentsBlockTranslations.shareThoughts[currentLocale],
      somethingWentWrong: commentsBlockTranslations.somethingWentWrong[currentLocale],
      submit: commentsBlockTranslations.submit[currentLocale],
      unnamedUser: commentsBlockTranslations.unnamedUser[currentLocale],
      writeYourComment: commentsBlockTranslations.writeYourComment[currentLocale],
    }
  }, [locale])
}
