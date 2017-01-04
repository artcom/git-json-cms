import Immutable from "immutable"

export function isSaving(state = false, { type }) {
  switch (type) {
    case "START_SAVING":
      return true

    case "UPDATE_DATA":
    case "SHOW_ERROR":
      return false

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

export function config(state = null, { type, payload }) {
  switch (type) {
    case "UPDATE_DATA":
      return payload.config

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

    case "UNDO_CHANGES":
      return payload.originalValue === undefined
        ? state.deleteIn(payload.path)
        : state.setIn(payload.path, payload.originalValue)

    case "FINISH_ENTITY_CREATION":
      return state.setIn(payload.path, payload.values)

    case "FINISH_ENTITY_RENAMING": {
      const parent = state.getIn(payload.path)
      const renamed = parent.mapKeys(name => name === payload.oldName ? payload.newName : name)
      return state.setIn(payload.path, renamed.toMap())
    }

    case "DELETE_ENTITY":
      return state.deleteIn(payload.path)

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

export function newEntity(state = null, { type, payload }) {
  switch (type) {
    case "START_ENTITY_CREATION":
      return payload

    case "UPDATE_ENTITY_CREATION":
      return { ...state, ...payload.params }

    case "FINISH_ENTITY_CREATION":
      return null

    case "CANCEL_ENTITY_CREATION":
      return null

    default:
      return state
  }
}

export function renamedEntity(state = null, { type, payload }) {
  switch (type) {
    case "START_ENTITY_RENAMING":
      return payload

    case "UPDATE_ENTITY_RENAMING":
      return { ...state, newName: payload.newName }

    case "FINISH_ENTITY_RENAMING":
      return null

    case "CANCEL_ENTITY_RENAMING":
      return null

    default:
      return state
  }
}

export function path(state = [], { type, payload }) {
  switch (type) {
    case "UPDATE_PATH":
      return payload.path

    default:
      return state
  }
}

export function flash(state = null, { type, payload }) {
  switch (type) {
    case "SHOW_ERROR":
      return payload

    case "HIDE_ERROR":
      return null

    default:
      return state
  }
}

export function progress(state = new Immutable.Map(), { type, payload }) {
  switch (type) {
    case "START_UPLOAD":
      return state.set(payload.path.toString(), 0)

    case "PROGRESS_UPLOAD":
      return state.set(payload.path.toString(), payload.progress)

    case "CHANGE_VALUE":
    case "CANCEL_UPLOAD":
      return state.delete(payload.path.toString())

    default:
      return state
  }
}
