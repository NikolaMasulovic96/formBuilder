import React, { useState }  from "react"
import "./form.css"
import FormBuilder from "./FormBuilder"
import FormField, { FieldModel } from "./formField/FormField"

const Form:React.FC = () => {

  const [fields, setFields] = useState<FieldModel[]>([])
  const [showData, setShowData] = useState<boolean>(false)

  function setValue(id:string, value:string) {
    fields.forEach((f) => {
      if(f.id === id){
        f.value = value
      }
    })
    if(showData === true) {
      setShowData(false)
    }
  }

  function addField(fieldModel: FieldModel) {
    setFields([...fields, fieldModel])
    setShowData(false)
  }

  function deleteField(id:string) {
    const newFields = fields.filter(field => field.id !== id)
    setFields(newFields)
    setShowData(false)
  }

  function validateForm() {
    const fieldsWithValidation: FieldModel[] = []
    fields.forEach((field) => {
      if(field.required && field.value === ""){
        field.errorMessage = "Field is required!"
      }else{
        field.errorMessage = undefined
      }
      fieldsWithValidation.push(field)
    })
    const res = fields.find((f) => f.errorMessage)
    setFields(fieldsWithValidation)
    return res === undefined
  }

  function submit() {
    setShowData(validateForm())
  }

  return <div className="main-container">
    <FormBuilder addField={addField} />
    <div className="column">
      {(fields && fields.length > 0) && <div className="form-container">
        {fields.map((field) => {
          return <FormField
            key={field.id}
            fieldModel={field}
            deleteField={deleteField}
            setValue={setValue}
             />
        })}
        <button className="builder-button" onClick={submit}>
          {"Submit"}
        </button>
      </div>}
      {showData && <table className="table">
        <tbody>
          <tr>
            <th>{"Field Name"}</th>
            <th>{"Value"}</th>
          </tr>
          {fields.map((field, i) => {
            return <tr key={field.id}>
              <td>{field.name}</td>
              <td>{field.value}</td>
            </tr>
          })}
        </tbody>
      </table>}
    </div>
  </div>
}

export default Form
