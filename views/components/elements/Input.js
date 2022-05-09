import React from 'react'
/**
 * Form input component. Use only within Formik component.
 * @param {object} props component properties
 * @param {string} props.label label title
 * @param {string=} props.placeholder input placeholder
 * @param {string} props.name name of the input
 * @param {string} props.type type of the input
 * @param {React.ComponentType<import('formik').ErrorMessageProps>} props.ErrorMessage error handler for 
 * @param {object} props.formikProps formik properties
 * @returns {React.ComponentType<import('@babel/types').Function>}
 */
export default function Input(props) {
  return (
    <div className="app__wrapper--input">
        <label htmlFor={props.name} className="app__label">{props.label}</label>
        <input type={props.type}
            name={props.name}
            id={props.name}
            className="app__input"
            onBlur={props.formikProps.handleBlur}
            onChange={props.formikProps.handleChange}
            values={props.formikProps.values[props.name]}
        />
        <props.ErrorMessage name={props.name} >{err => <p className="app__paragraph--error">{err}</p>}</props.ErrorMessage>
    </div>
  )
}
