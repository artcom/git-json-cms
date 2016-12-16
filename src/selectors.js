import Immutable from "immutable"
import kebabCase from "lodash/kebabCase"
import { createSelector } from "reselect"

import { evaluate } from "./condition"

const INDEX_KEY = "index"
const TEMPLATE_KEY = "template"

export const getOriginalContent = (state) => state.originalContent
export const getChangedContent = (state) => state.changedContent
export const getTemplates = (state) => state.templates
export const getPath = (state) => state.path
export const getConfig = (state) => state.config

export const getNewEntity = (state) => {
  if (!state.newEntity) {
    return {
      isVisible: false,
      name: "",
      templates: []
    }
  }

  return { ...state.newEntity,
    isValidName: state.newEntity.name.length > 0 && state.newEntity.name !== "index",
    isVisible: true
  }
}

export const getNewEntityPath = createSelector(
  [getNewEntity, getPath],
  (newEntity, path) => [...path, kebabCase(newEntity.name), INDEX_KEY]
)

export const getNewEntityValues = createSelector(
  [getNewEntity, getTemplates],
  (newEntity, templates) => {
    const template = templates[newEntity.template]

    const values = new Immutable.Map(template.fields.map(field => [
      field.name,
      defaultValue(field)
    ]))

    return values
      .filter((value, name) => {
        const field = template.fields.find(item => item.name === name)
        return !field.condition || evaluate(field.condition, values)
      })
      .set("template", newEntity.template)
  }
)

function defaultValue(field) {
  switch (field.type) {
    case "enum":
      return field.values[0].value

    case "markdown":
    case "string":
      return ""

    default:
      return null
  }
}

export const getOriginalEntity = createSelector(
  [getOriginalContent, getPath],
  (originalContent, path) => originalContent.getIn(path, new Immutable.Map())
)

export const getChangedEntity = createSelector(
  [getChangedContent, getPath],
  (changedContent, path) => changedContent.getIn(path)
)

export const getOriginalValues = createSelector(
  [getOriginalEntity],
  (originalEntity) => originalEntity.get(INDEX_KEY, new Immutable.Map())
)

export const getChangedValues = createSelector(
  [getChangedEntity],
  (changedEntity) => changedEntity.get(INDEX_KEY)
)

export const getTemplate = createSelector(
  [getTemplates, getChangedValues],
  (templates, changedValues) => templates[changedValues.get(TEMPLATE_KEY)]
)

export const getTemplateChildren = createSelector(
  [getTemplate],
  (template) => template.children || []
)

export const getFields = createSelector(
  [getTemplate, getOriginalValues, getChangedValues, getPath, getConfig],
  (template, originalValues, changedValues, path, config) => template.fields
    .filter(field => !field.condition || evaluate(field.condition, changedValues))
    .map(field => {
      const originalValue = originalValues.get(field.name)
      const changedValue = changedValues.get(field.name)

      return { ...field,
        hasChanged: !Immutable.is(originalValue, changedValue),
        isLocalized: isLocalized(changedValue, config.languages),
        path: [...path, INDEX_KEY, field.name],
        value: changedValue
      }
    })
)

function isLocalized(value, languages) {
  return Immutable.Map.isMap(value) && languages.every(language => value.has(language))
}

export const getChildren = createSelector(
  [getOriginalEntity, getChangedEntity, getPath],
  (originalEntity, changedEntity, path) => changedEntity.keySeq()
    .filter(key => key !== INDEX_KEY)
    .map(child => ({
      hasChanged: !Immutable.is(originalEntity.get(child), changedEntity.get(child)),
      name: child,
      path: [...path, child]
    }))
)