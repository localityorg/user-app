export const validateDeliveryAddress = (delivery: any) => {
  const errors: any = {};
  if (delivery.name === '') {
    errors.name = 'Name must not be empty';
  }

  if (delivery.line1 === '') {
    errors.price = 'Street/Block must not be empty';
  } else if (delivery.line2 === '') {
    errors.barcode = 'City must not be empty';
  }

  if (delivery.pincode === '') {
    errors.pincode = 'Pincode cannot be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateCreateOrderInput = (delivery: any, payment: any, store: any) => {
  const errors: any = {};
  if (delivery === null || delivery.line1 === '' || delivery.line2 === '') {
    errors.delivery = 'Address not selected. Try again';
  } else if (payment === null) {
    errors.payment = 'No Payment method selected';
  } else if (store === null && payment?.type === 'KHATA') {
    errors.store = 'No Store selected for Khata payment';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
