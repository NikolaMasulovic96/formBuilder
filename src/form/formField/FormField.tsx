import React from "react"
import { Range } from "../FormBuilder"
import "./form-field.css"

export enum FromFieldType {
  TEXT_INPUT = "text input",
  NUMBER_INPUT = "number input",
  CHECKBOX = "checkbox",
  RADIO_GROUP = "radio group",
  SELECT_DROPDOWN = "select dropdown"
}

export const fieldTypes = [FromFieldType.TEXT_INPUT, FromFieldType.NUMBER_INPUT,
  FromFieldType.CHECKBOX, FromFieldType.RADIO_GROUP, FromFieldType.SELECT_DROPDOWN]

export interface FieldModel {
  id: string
  name: string
  type: string
  required: boolean
  value: string
  options?: string[]
  range: Range
  errorMessage: string | undefined
}

export interface FormFieldProps {
  fieldModel: FieldModel
  deleteField(id:string): void
  setValue(id:string, value:string): void
}

const FormField:React.FC<FormFieldProps> = ({ fieldModel, deleteField, setValue }) => {

  const { id, name, type, required, value, options, errorMessage } = fieldModel

  function renderField(type: string) {
    switch (type) {
      case FromFieldType.TEXT_INPUT:
        return <input
          type={"text"}
          defaultValue={value}
          onChange={(val) => setValue(id, val.currentTarget.value)} />
      case FromFieldType.NUMBER_INPUT:
        return <input
          type={"number"}
          defaultValue={value}
          onChange={(val) => setValue(id, val.currentTarget.value)} />
      case FromFieldType.CHECKBOX:
        return <input
          type="checkbox"
          defaultChecked={value === "on"}
          onChange={(val) => setValue(id, val.currentTarget.value)} />
      case FromFieldType.SELECT_DROPDOWN:
        return <select
          defaultValue={value}
          onChange={(val) => setValue(id, val.currentTarget.value)}>
          {options && options.map((option) => <option value={option}>{option}</option>)}
        </select>
      case FromFieldType.RADIO_GROUP:
        return <>{options && options.map((option) => {
          return <div>
            <label>
              <input
                type="radio"
                value={option}
                checked={value === option}
                onChange={(val) => setValue(id, val.currentTarget.value)}
              />
              {option}
            </label>
          </div>
        })}</>
      default:
        return <></>
    }
  }

  return <div className="form-field-container">
    <div className="label">
      {required && <span className="required-mark">*</span>}
      <span>{name}:</span>
    </div>
    <div className="field">
      {renderField(type)}
      <button className="delete-button" onClick={() => deleteField(id)}>
        {"Delete"}
      </button>
    </div>
    {errorMessage && <span className="error-message">{errorMessage}</span>}
  </div>
}

export default FormField
