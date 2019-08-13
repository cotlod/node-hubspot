import { RequestPromise } from 'request-promise'

class GetContactsOption {
  count?: number = 20
  vidOffset?: number
  propertyMode?: 'value_only' | 'value_and_history' = 'value_only'
  formSubmissionMode?: 'all' | 'none' | 'newest' | 'oldest' = 'newest'
  showListMemberships?: boolean = false
  property?: string
}

declare class List {
  get(opts?: {}): RequestPromise

  getOne(id: number): RequestPromise

  getContacts(id: number, opts?: GetContactsOption): RequestPromise

  getRecentContacts(id: number): RequestPromise

  addContacts(id: number, contactBody: {}): RequestPromise
}

export { List, GetContactsOption }
