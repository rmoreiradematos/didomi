import { CreateEventResponseModel } from '@application/useCases/createEvent/createEvent.responseModel'

interface Consent {
  id: string
  enabled: boolean
}

export function mappingConsents(
  consents: CreateEventResponseModel[],
): Consent[] {
  return consents.map((consent) => {
    return {
      id: consent.id,
      enabled: consent.enabled,
    }
  })
}
