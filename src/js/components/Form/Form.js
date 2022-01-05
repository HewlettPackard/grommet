import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MessageContext } from '../../contexts/MessageContext';
import { FormContext } from './FormContext';
import { FormPropTypes } from './propTypes';

const defaultValue = {};
const defaultTouched = {};
const defaultValidationResults = {
  errors: {},
  infos: {},
};

const stringToArray = (string) => {
  const match = string?.match(/^(.+)\[([0-9]+)\]\.(.*)$/);
  if (match) {
    const [, arrayName, indexOfArray, arrayObjName] = match;
    return {
      indexOfArray,
      arrayName,
      arrayObjName,
    };
  }
  return undefined;
};

const getFieldValue = (name, value) => {
  const isArrayField = stringToArray(name);
  if (isArrayField) {
    const { indexOfArray, arrayName, arrayObjName } = isArrayField;
    const obj = value[arrayName]?.[indexOfArray];
    return arrayObjName ? obj?.[arrayObjName] : obj;
  }
  return value[name];
};

const setFieldValue = (name, componentValue, prevValue) => {
  const nextValue = { ...prevValue };
  const isArrayField = stringToArray(name);
  if (isArrayField) {
    const { indexOfArray, arrayName, arrayObjName } = isArrayField;
    if (!nextValue[arrayName]) nextValue[arrayName] = [];
    if (arrayObjName) {
      if (!nextValue[arrayName][indexOfArray])
        nextValue[arrayName][indexOfArray] = {
          [arrayObjName]: componentValue,
        };
      nextValue[arrayName][indexOfArray][arrayObjName] = componentValue;
    } else nextValue[arrayName][indexOfArray] = componentValue;
  } else {
    nextValue[name] = componentValue;
  }
  return nextValue;
};

// Apply validation rule to field value and send correct messaging.
const validate = (rule, fieldValue, formValue, format, messages) => {
  let result;
  if (typeof rule === 'function') {
    result = rule(fieldValue, formValue);
  } else if (rule.regexp) {
    if (!rule.regexp.test(fieldValue)) {
      result = rule.message || format({ id: 'form.invalid', messages });
      if (rule.status) {
        result = { message: result, status: rule.status };
      }
    }
  }
  return result;
};

// Validates particular key in formValue
const validateName =
  (validationRules, required) => (name, formValue, format, messages) => {
    const fieldValue = getFieldValue(name, formValue);
    let validationResult;
    // ValidateArg is something that gets passed in from a FormField component
    // See 'validate' prop in FormField
    if (
      required &&
      // false is for CheckBox
      (fieldValue === undefined ||
        fieldValue === '' ||
        fieldValue === false ||
        (Array.isArray(fieldValue) && !fieldValue.length))
    ) {
      // There is no value at that name, and one is required
      validationResult = format({ id: 'form.required', messages });
    } else if (validationRules) {
      if (Array.isArray(validationRules)) {
        validationRules.some((validator) => {
          validationResult = validate(
            validator,
            fieldValue,
            formValue,
            format,
            messages,
          );
          return !!validationResult;
        });
      } else {
        validationResult = validate(
          validationRules,
          fieldValue,
          formValue,
          format,
          messages,
        );
      }
    }
    return validationResult;
  };

// validations is an array from Object.entries()
// Validates all keys in formValue
const validateForm = (
  validationRules,
  formValue,
  format,
  messages,
  omitValid,
) => {
  const nextErrors = {};
  const nextInfos = {};
  validationRules.forEach(([name, { field, input }]) => {
    if (!omitValid) {
      nextErrors[name] = undefined;
      nextInfos[name] = undefined;
    }

    let result;
    if (input) {
      // input() a validation function supplied through useFormInput()
      result = input(name, formValue, format, messages);
    }
    if (field && !result) {
      // field() a validation function supplied through useFormField()
      result = field(name, formValue, format, messages);
    }
    // typeof error === 'object' is implied for both cases of error with
    // a status message and for an error object that is a react node
    if (typeof result === 'object') {
      if (result.status === 'info') {
        nextInfos[name] = result.message;
      } else {
        nextErrors[name] = result.message || result; // could be a node
      }
    } else if (typeof result === 'string') {
      nextErrors[name] = result;
    }
  });
  return [nextErrors, nextInfos];
};

const Form = forwardRef(
  (
    {
      children,
      errors: errorsProp = defaultValidationResults.errors,
      infos: infosProp = defaultValidationResults.infos,
      messages,
      onChange,
      onReset,
      onSubmit,
      onValidate,
      validate: validateOn = 'submit',
      value: valueProp,
      ...rest
    },
    ref,
  ) => {
    const { format } = useContext(MessageContext);

    const [valueState, setValueState] = useState(valueProp || defaultValue);
    const value = useMemo(
      () => valueProp || valueState,
      [valueProp, valueState],
    );
    const [touched, setTouched] = useState(defaultTouched);
    const [validationResults, setValidationResults] = useState(
      defaultValidationResults,
    );
    // when onBlur input validation is triggered, we need to complete any
    // potential click events before running the onBlur validation.
    // otherwise, click events like reset, etc. may not be registered.
    // for a detailed scenario/discussion,
    // see: https://github.com/grommet/grommet/issues/4863
    // the value of pendingValidation is the name of the FormField
    // awaiting validation.
    const [pendingValidation, setPendingValidation] = useState(undefined);

    useEffect(() => {
      setPendingValidation(undefined);
      setValidationResults({ errors: errorsProp, infos: infosProp });
    }, [errorsProp, infosProp]);

    const validationRulesRef = useRef({});
    const requiredFields = useRef([]);

    const buildValid = useCallback(
      (nextErrors) => {
        let valid = false;
        valid = requiredFields.current
          .filter((n) => Object.keys(validationRulesRef.current).includes(n))
          .every(
            (field) =>
              value[field] && (value[field] !== '' || value[field] !== false),
          );

        if (Object.keys(nextErrors).length > 0) valid = false;
        return valid;
      },
      [value],
    );

    // Only keep validation results for current form fields. In the case of a
    // dynamic form, a field possessing an error may have been removed from the
    // form; need to clean up any previous related validation results.
    const filterRemovedFields = (prevValidations) => {
      const nextValidations = prevValidations;
      return Object.keys(nextValidations)
        .filter(
          (n) =>
            !validationRulesRef.current[n] || nextValidations[n] === undefined,
        )
        .forEach((n) => delete nextValidations[n]);
    };

    // On initial mount, when validateOn is change or blur,
    // set validation results for any set fields and calculate whether
    // the form is valid overall.
    useEffect(() => {
      const validationsForSetFields = Object.entries(
        validationRulesRef.current,
      ).filter(([n]) => getFieldValue(n, value));
      if (validationsForSetFields.length > 0 && validateOn !== 'submit') {
        const [errors, infos] = validateForm(
          validationsForSetFields,
          value,
          format,
          messages,
        );
        filterRemovedFields(errors);
        filterRemovedFields(infos);

        const nextValidationResults = {
          errors,
          infos,
          valid: buildValid(errors),
        };
        if (onValidate) onValidate(nextValidationResults);
        setValidationResults(nextValidationResults);
      }
      // We only want to run this for the value we have on initial mount.
      // We don't want subsequent changes to the value to re-run this.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Currently, onBlur validation will trigger after a timeout of 120ms.
    useEffect(() => {
      const timer = setTimeout(() => {
        if (pendingValidation) {
          // run validations on the pending one and any other touched fields
          const [validatedErrors, validatedInfos] = validateForm(
            Object.entries(validationRulesRef.current).filter(
              ([n]) => touched[n] || pendingValidation.includes(n),
            ),
            value,
            format,
            messages,
          );
          setPendingValidation(undefined);

          setValidationResults((prevValidationResults) => {
            // keep any previous errors and infos for untouched keys,
            // these may have come from a submit
            const nextErrors = {
              ...prevValidationResults.errors,
              ...validatedErrors,
            };
            const nextInfos = {
              ...prevValidationResults.infos,
              ...validatedInfos,
            };

            filterRemovedFields(nextErrors);
            filterRemovedFields(nextInfos);

            const nextValidationResults = {
              errors: nextErrors,
              infos: nextInfos,
              valid: buildValid(nextErrors),
            };
            if (onValidate) onValidate(nextValidationResults);
            return nextValidationResults;
          });
        }
        // a timeout is needed to ensure that a click event (like one on a reset
        // button) completes prior to running the validation. without a timeout,
        // the blur will always complete and trigger a validation prematurely
        // The following values have been empirically tested, but 120 was
        // selected because it is the largest value
        // Chrome: 100, Safari: 120, Firefox: 80
      }, 120);

      return () => clearTimeout(timer);
    }, [
      buildValid,
      format,
      messages,
      pendingValidation,
      onValidate,
      touched,
      value,
      requiredFields,
    ]);

    // clear any errors when value changes
    useEffect(() => {
      if (validateOn !== 'change') setPendingValidation(undefined);
      setValidationResults((prevValidationResults) => {
        const [nextErrors, nextInfos] = validateForm(
          Object.entries(validationRulesRef.current).filter(
            ([n]) =>
              prevValidationResults.errors[n] || prevValidationResults.infos[n],
          ),
          value,
          format,
          messages,
        );
        return {
          errors: { ...prevValidationResults.errors, ...nextErrors },
          infos: { ...prevValidationResults.infos, ...nextInfos },
        };
      });
    }, [format, messages, touched, validateOn, value]);

    // There are three basic patterns of handling form input value state:
    //
    // 1 - form controlled
    //
    // In this model, the caller sets `value` and `onChange` properties
    // on the Form component to supply the values used by the input fields.
    // In useFormContext(), componentValue would be undefined and formValue
    // is be set to whatever the form state has. Whenever the form state
    // changes, we update the contextValue so the input component will use
    // that. When the input component changes, we will call update() to
    // update the form state.
    //
    // 2 - input controlled
    //
    // In this model, the caller sets `value` and `onChange` properties
    // on the input components, like TextInput, to supply the value for it.
    // In useFormContext(), componentValue is this value and we ensure to
    // update the form state, via update(), and set the contextValue from
    // the componentValue. When the input component changes, we will
    // call update() to update the form state.
    //
    // 3 - uncontrolled
    //
    // In this model, the caller doesn't set a `value` or `onChange` property
    // at either the form or input component levels.
    // In useFormContext(), componentValue is undefined and valueProp is
    // undefined and nothing much happens here. That is, unless the
    // calling component needs to know the state in order to work, such
    // as CheckBox or Select. In this case, those components supply
    // an initialValue, which will trigger updating the contextValue so
    // they can have access to it.
    //
    const formContextValue = useMemo(() => {
      const useFormInput = ({
        name,
        value: componentValue,
        initialValue,
        validate: validateArg,
      }) => {
        const [inputValue, setInputValue] = useState(initialValue);
        const formValue = name ? getFieldValue(name, value) : undefined;
        // for dynamic forms, we need to track when an input has been added to
        // the form value. if the input is unmounted, we will delete its
        // key/value from the form value.
        const keyCreated = useRef(false);

        // This effect is for pattern #2, where the controlled input
        // component is driving the value via componentValue.
        useEffect(() => {
          if (
            name && // we have somewhere to put this
            componentValue !== undefined && // input driving
            componentValue !== formValue // don't already have it
          ) {
            setValueState((prevValue) =>
              setFieldValue(name, componentValue, prevValue),
            );
            // don't onChange on programmatic changes
          }
        }, [componentValue, formValue, name]);

        // on unmount, if the form is uncontrolled, remove the key/value
        // from the form value
        useEffect(
          () => () => {
            if (keyCreated.current) {
              keyCreated.current = false;
              setValueState((prevValue) => {
                const nextValue = { ...prevValue };
                const isArrayField = stringToArray(name);
                if (isArrayField) {
                  const { arrayName } = isArrayField;
                  delete nextValue[arrayName];
                } else {
                  delete nextValue[name];
                }
                return nextValue;
              });
            }
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [], // only run onmount and unmount
        );

        useEffect(() => {
          if (validateArg) {
            if (!validationRulesRef.current[name]) {
              validationRulesRef.current[name] = {};
            }
            validationRulesRef.current[name].input = validateName(validateArg);
            return () => delete validationRulesRef.current[name].input;
          }
          return undefined;
        }, [validateArg, name]);

        let useValue;
        if (componentValue !== undefined)
          // input component drives, pattern #2
          useValue = componentValue;
        else if (valueProp && name && formValue !== undefined)
          // form drives, pattern #1
          useValue = formValue;
        else if (formValue === undefined && name)
          // form has reset, so reset input value as well
          useValue = initialValue;
        else useValue = inputValue;

        return [
          useValue,
          (nextComponentValue) => {
            if (name) {
              // we have somewhere to put this
              const nextTouched = { ...touched };
              nextTouched[name] = true;

              if (!touched[name]) {
                // don't update if not needed
                setTouched(nextTouched);
              }

              // if nextValue doesn't have a key for name, this must be
              // uncontrolled form. we will flag this field was added so
              // we know to remove its value from the form if it is dynamically
              // removed
              if (!(name in value)) keyCreated.current = true;
              const nextValue = setFieldValue(
                name,
                nextComponentValue,
                value,
              );
              setValueState(nextValue);
              if (onChange) onChange(nextValue, { touched: nextTouched });
            }
            if (initialValue !== undefined) setInputValue(nextComponentValue);
          },
        ];
      };

      const useFormField = ({
        error: errorArg,
        info: infoArg,
        name,
        required,
        disabled,
        validate: validateArg,
      }) => {
        const error = disabled
          ? undefined
          : errorArg || validationResults.errors[name];
        const info = infoArg || validationResults.infos[name];

        useEffect(() => {
          const index = requiredFields.current.indexOf(name);
          if (required) {
            if (index === -1) requiredFields.current.push(name);
          } else if (index !== -1) requiredFields.current.splice(index, 1);

          if (validateArg || required) {
            if (!validationRulesRef.current[name]) {
              validationRulesRef.current[name] = {};
            }
            validationRulesRef.current[name].field = validateName(
              validateArg,
              required,
            );
            return () => delete validationRulesRef.current[name].field;
          }

          return undefined;
        }, [error, name, required, validateArg, disabled]);

        return {
          error,
          info,
          inForm: true,
          onBlur:
            validateOn === 'blur'
              ? () =>
                  setPendingValidation(
                    pendingValidation ? [...pendingValidation, name] : [name],
                  )
              : undefined,
          onChange:
            validateOn === 'change'
              ? () =>
                  setPendingValidation(
                    pendingValidation ? [...pendingValidation, name] : [name],
                  )
              : undefined,
        };
      };

      return { useFormField, useFormInput };
    }, [
      onChange,
      pendingValidation,
      touched,
      validateOn,
      validationResults.errors,
      validationResults.infos,
      value,
      valueProp,
    ]);

    return (
      <form
        ref={ref}
        {...rest}
        onReset={(event) => {
          setPendingValidation(undefined);
          if (!valueProp) {
            setValueState(defaultValue);
            if (onChange) onChange(defaultValue, { touched: defaultTouched });
          }
          setTouched(defaultTouched);
          setValidationResults(defaultValidationResults);

          if (onReset) {
            event.persist(); // extract from React's synthetic event pool
            const adjustedEvent = event;
            adjustedEvent.value = defaultValue;
            onReset(adjustedEvent);
          }
        }}
        onSubmit={(event) => {
          // Don't submit the form via browser form action. We don't want it
          // if the validation fails. And, we assume a javascript action handler
          // otherwise.
          event.preventDefault();
          setPendingValidation(undefined);
          const [nextErrors, nextInfos] = validateForm(
            Object.entries(validationRulesRef.current),
            value,
            format,
            messages,
            true,
          );

          setValidationResults(() => {
            const nextValidationResults = {
              errors: nextErrors,
              infos: nextInfos,
              // Show form's validity when clicking on Submit
              valid: buildValid(nextErrors),
            };
            if (onValidate) onValidate(nextValidationResults);
            return nextValidationResults;
          });

          if (Object.keys(nextErrors).length === 0 && onSubmit) {
            event.persist(); // extract from React's synthetic event pool
            const adjustedEvent = event;
            adjustedEvent.value = value;
            adjustedEvent.touched = touched;
            onSubmit(adjustedEvent);
          }
        }}
      >
        <FormContext.Provider value={formContextValue}>
          {children}
        </FormContext.Provider>
      </form>
    );
  },
);

Form.displayName = 'Form';
Form.propTypes = FormPropTypes;

export { Form };
