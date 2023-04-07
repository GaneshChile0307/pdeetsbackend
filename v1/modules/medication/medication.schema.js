const addMedicationReminderSchema = {
  type: 'object',
  properties: {
    medicineName: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    dosageQty: {
      type: 'number'
    },
    dosageUnit: {
      type: 'string'
    },
    dosageInterval: {
      type: 'integer'
    },
    dosageIntervalUnit: {
      type: 'string',
      enum: ['day', 'week', 'month']
    },
    medicationTime: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          unit: {
            type: 'string',
            enum: ['before_breakfast', 'after_breakfast', 'before_meal', 'after_meal', 'before_dinner', 'after_dinner']
          },
          time: {
            type: 'string'
          }
        },
        required: ['unit', 'time']
      }
    },
    reminderTime: {
      type: 'integer'
    },
    reminderTimeUnit: {
      type: 'string',
      enum: ['day', 'week', 'month']
    },
    startDate: {
      type: 'string',
      format: 'date-time'
    },
    specialRemarks: {
      type: 'string'
    }
  },
  required: ['medicineName', 'dosageQty', 'dosageInterval', 'dosageIntervalUnit', 'medicationTime', 'reminderTime', 'reminderTimeUnit', 'startDate'],
  additionalProperties: false
}

const updateMedicationReminderSchema = {
  type: 'object',
  properties: {
    medicineName: {
      type: 'string'
    },
    dosageQty: {
      type: 'number'
    },
    dosageUnit: {
      type: 'string'
    },
    dosageInterval: {
      type: 'integer'
    },
    dosageIntervalUnit: {
      type: 'string',
      enum: ['day', 'week', 'month']
    },
    medicationTime: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          unit: {
            type: 'string',
            enum: ['before_breakfast', 'after_breakfast', 'before_meal', 'after_meal', 'before_dinner', 'after_dinner']
          },
          time: {
            type: 'string'
          }
        },
        required: ['unit', 'time']
      }
    },
    reminderTime: {
      type: 'integer'
    },
    reminderTimeUnit: {
      type: 'string',
      enum: ['day', 'week', 'month']
    },
    startDate: {
      type: 'string',
      format: 'date-time'
    },
    specialRemarks: {
      type: 'string'
    }
  },
  additionalProperties: false
}

module.exports = {
  addMedicationReminderSchema,
  updateMedicationReminderSchema
}
