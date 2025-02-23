import { Schema } from 'mongoose';

export const BaseEntitySchemaContent = {
  created_on: {
    type: Date,
    default: Date.now,
  },
  last_modified_on: {
    type: Date,
    default: Date.now,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  changed_by: {
    type: Schema.Types.Mixed,
    index: true,
    unique: false,
  },
};

export const BaseNameSchemaContent = {
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
};

export const BaseAddressSchemaContent = {
  no: { type: String, required: true },
  street1: { type: String, required: true },
  street2: { type: String },
  city: { type: String, required: true },
  province: { type: String, required: true },
  country: { type: String, required: true },
};
