import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidCpfOrCnpj', async: false })
export class IsValidCpfOrCnpjConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    const cpfCnpjRegex =
      /^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$|^(?:\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/;
    return cpfCnpjRegex.test(value);
  }

  defaultMessage() {
    return 'Invalid CPF or CNPJ format';
  }
}

export function IsValidCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCpfOrCnpjConstraint,
    });
  };
}
