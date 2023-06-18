import React, { useState }  from "react"
import "./form.css"
import { FieldModel, fieldTypes, FromFieldType } from "./formField/FormField"

export interface Range {
  min: number
  max: number
}

interface FormBuilderProps {
  addField(fieldModel: FieldModel): void
}

const FormBuilder:React.FC<FormBuilderProps> = ({ addField }) => {

  const [fieldName, setFieldName] = useState<string>("")
  const [fieldType, setFieldType] = useState<string>(FromFieldType.TEXT_INPUT)
  const [range, setRange] = useState<Range>({min: 0, max: 100})
  const [isRequired, setIsRequired] = useState<boolean>(false)
  const [options, setOptions] = useState<string>("")
  const [validationMessage, setValidationMessage] = useState<boolean>(false)

  function validateBuilderFields(){
    let isFormValid = true
    if(fieldName === "") isFormValid = false
    if(fieldType === FromFieldType.RADIO_GROUP || fieldType === FromFieldType.SELECT_DROPDOWN){
      const optionsWithoutComma = options.split(",")
      optionsWithoutComma.forEach((o) => {
        if(!/^(\w+):\s*(\w+)*/.test(o)){
          isFormValid = false
        }
      })
    }
    return isFormValid
  }

  function resetBuilder() {
    setFieldName("")
    setFieldType(FromFieldType.TEXT_INPUT)
    setIsRequired(false)
    setOptions("")
  }

  function parseOptions() {
    const parsedOptions: string[] = []
    const pars = options.split(",")
    pars.forEach((p) => parsedOptions.push(p.split(":")[1]))
    return parsedOptions
  }

  function getDefaultValue(options: string[]){
    const defaultValue = ""
    if(fieldType === FromFieldType.SELECT_DROPDOWN){
      return options[0]
    }
    if(fieldType === FromFieldType.NUMBER_INPUT){
      return "0"
    }
    return defaultValue
  }

  function submit() {
    if (validateBuilderFields()) {
      const parsedOptions = parseOptions()
      const newField: FieldModel = {
        id: fieldName + Math.random(),
        name: fieldName,
        type: fieldType,
        required: isRequired,
        value: getDefaultValue(parsedOptions),
        options: parsedOptions,
        range: range,
        errorMessage: undefined,
      }
      addField(newField)
      resetBuilder()
      setValidationMessage(false)
    } else {
      setValidationMessage(true)
    }
  }

  return <div className="builder-container">
    <span>{"Add new field:"}</span>
    <div className="builder-field">
      <span className="builder-field-label">{"Field Name:"}</span>
      <input
        type={"text"}
        value={fieldName}
        onChange={(val) => setFieldName(val.currentTarget.value)} />
    </div>
    <div className="builder-field">
      <span className="builder-field-label">{"Field Type:"}</span>
      <select onChange={(val) => setFieldType(val.currentTarget.value)} value={fieldType}>
        {fieldTypes.map((type, i) => {
          return <option key={i} value={type}>{type.toString()}</option>
        })}
      </select>
    </div>
    {fieldType === FromFieldType.NUMBER_INPUT && <div className="builder-field">
    <span className="builder-field-label">{"Number range:"}</span>
      <input
        type={"number"}
        defaultValue={range.min}
        onChange={(val) => setRange({...range, min: +val.currentTarget.value})} />
      <input
        type={"number"}
        defaultValue={range.max}
        onChange={(val) => setRange({...range, max: +val.currentTarget.value})} />
    </div>}
    <div className="builder-field row">
      <span className="builder-field-label">{"Is field required:"}</span>
      <input
        type="checkbox"
        checked={isRequired}
        onChange={() => setIsRequired(!isRequired)} />
    </div>
    <div className="builder-field">
      <span className="builder-field-label">{"Options:"}</span>
      <input
        value={options}
        disabled={fieldType !== FromFieldType.RADIO_GROUP && fieldType !== FromFieldType.SELECT_DROPDOWN}
        type={"text"}
        onChange={(val) => setOptions(val.currentTarget.value)}
      />
      <span>{"Options must be key:value par separated with comma without spaces!"}</span>
    </div>
    <button className="builder-button" onClick={submit}>{"Add field"}</button>
    {validationMessage && <span className="validation-message">
      {"You must enter all fields!"}
    </span>}
  </div>
}

export default FormBuilder
