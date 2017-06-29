Ext.define('expand.ux.AdvancedVType', {
    override: 'Ext.form.field.VTypes',

    daterange: function(val, field) {
        var date = field.parseDate(val);

        if(!date) {
            return false;
        }
        if(field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = field.up().down('#' + field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if(field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = field.up().down('#' + field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    },

    daterangeText: 'Start date must be less than end date',

    password: function(val, field) {
        if(field.initialPassField) {
            var pwd = field.up('form').down('#' + field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    passwordText: 'Passwords do not match',

    phone: function (val, field) {
        try {
            if (/^(((13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])[0-9]{8})|(1349[0-9]{7}))$/.test(val))
                return true;
            return false;
        }
        catch (e) {
            return false;
        }
    },
    phoneText: '请输入正确的11位手机号码'
});
