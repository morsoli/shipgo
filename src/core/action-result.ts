import type { ZodError } from "zod"

export type ActionError = {
  code: string
  message: string
  fieldErrors?: Record<string, string[]>
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: ActionError }

export function actionSuccess<T>(data?: T): ActionResult<T> {
  return { success: true, data }
}

export function actionFailure(code: string, message: string): ActionResult<never> {
  return { success: false, error: { code, message } }
}

export function validationFailure(error: ZodError): ActionResult<never> {
  return {
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "The submitted data is invalid.",
      fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
    },
  }
}
