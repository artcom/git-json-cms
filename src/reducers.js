import Immutable from "immutable"

export function config(state = null, { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return payload.config

    default:
      return state
  }
}

export function originalContent(state = null, { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return Immutable.fromJS(payload.content)

    default:
      return state
  }
}

export function changedContent(state = null, { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return Immutable.fromJS(payload.content)

    case "CHANGE_VALUE":
      return state.setIn(payload.path, payload.value)

    case "DELETE_ENTITY":
      return state.deleteIn(payload)

    case "LOCALIZE": {
      const value = state.getIn(payload.path)
      const pairs = payload.languages.map(language => [language, value])
      return state.setIn(payload.path, new Immutable.Map(pairs))
    }

    case "UNLOCALIZE":
      return state.setIn(payload.path, state.getIn([...payload.path, payload.defaultLanguage]))

    default:
      return state
  }
}

export function templates(state = null, { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return payload.templates

    default:
      return state
  }
}

export function version(state = null, { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return payload.version

    default:
      return state
  }
}

export function path(state = [], { type, payload }) {
  switch (type) {
    case "UPDATE_PATH":
      return payload

    default:
      return state
  }
}
