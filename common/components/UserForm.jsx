import React, {Component, PropTypes} from 'react'
import {reduxForm} from 'redux-form'

import DatePicker from 'react-toolbox/lib/date_picker'
import Dropdown from 'react-toolbox/lib/dropdown'
import Input from 'react-toolbox/lib/input'
import {Button} from 'react-toolbox/lib/button'

class UserForm extends Component {
  render() {
    const {
      fields: {email, handle, name, phone, dateOfBirth, timezone},
      currentUser,
      handleSubmit,
      onSubmit,
      submitting,
    } = this.props

    // email
    const emails = currentUser ? currentUser.emails.map(email => ({value: email, label: email})) : []

    // phone
    const handlePhoneKeyUp = e => {
      const fieldValue = e.target.value
      const phoneDigits = fieldValue.replace(/\D/g, '')
      let areaCode = phoneDigits.slice(0, 3)
      let prefix = phoneDigits.slice(3, 6)
      let suffix = phoneDigits.slice(6, 10)
      let formatted = '' + areaCode
      if (formatted.length > 2) {
        formatted += '-' + prefix
      }
      if (formatted.length > 6) {
        formatted += '-' + suffix
      }
      phone.onChange(formatted)
    }

    // dateOfBirth
    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setYear(now.getFullYear() - 21)
    const dob = dateOfBirth.value ? new Date(dateOfBirth.value) : undefined
    const handleDateOfBirthChange = newDateOfBirth => {
      dateOfBirth.onChange(newDateOfBirth.toISOString())
    }

    // timezone
    const tz = timezone.defaultValue || Intl.DateTimeFormat().resolved.timeZone

    return (
      <form
        onSubmit={
          handleSubmit(() => {
            onSubmit()
          })
        }
        >
        <Dropdown
          auto
          label="Email"
          source={emails}
          {...email}
          />
        <Input
          disabled
          type="text"
          label="Handle (update on GitHub)"
          value={handle.defaultValue}
          />
        <Input
          type="text"
          label="Name"
          {...name}
          />
        <Input
          type="tel"
          label="Phone"
          onKeyUp={handlePhoneKeyUp}
          {...phone}
          />
        <DatePicker
          label="Date of Birth"
          maxDate={maxDate}
          value={dob}
          onChange={handleDateOfBirthChange}
          />
        <Input
          disabled
          type="text"
          label="Timezone (from browser)"
          {...timezone}
          value={tz}
          />
        <Button
          label="Sign Up"
          primary
          raised
          disabled={submitting}
          type="submit"
          />
      </form>
    )
  }
}

UserForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func/*.isRequired*/,
  submitting: PropTypes.bool.isRequired,
}

function validate({name, phone}) {
  const errors = {}
  if (!name || !name.match(/\w{2,}\ \w{2,}/)) {
    errors.name = 'Include both family and given name'
  }
  if (!phone || !phone.match(/(\d{3}\-?){2}\d{4}/)) {
    errors.phone = '3-digit area code and 7-digit phone number'
  }
  return errors
}

export default reduxForm({
  form: 'signUp',
  fields: ['email', 'handle', 'name', 'phone', 'dateOfBirth', 'timezone'],
  validate,
}, state => ({
  currentUser: state.auth.currentUser,
  initialValues: state.auth.currentUser, // TODO: upgrade redux-form when this is fixed: https://github.com/erikras/redux-form/issues/621#issuecomment-181898392
}), {
  // onSubmit:
})(UserForm)