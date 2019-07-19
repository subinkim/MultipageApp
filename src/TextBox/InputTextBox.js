import React from 'react';
import { Item, Input, Icon, Label } from 'native-base';

class InputTextBox extends React.Component {

    render() {
        const { label, icon, onChange, keyboard, returnKey } = this.props;
        return (
            <Item>
                <Icon active name={icon} />
                <Input
                  placeholder = { label }
                  onChangeText={(e) => onChange(e)}
                  keyboardType={ keyboard }
                  returnKeyType = { returnKey }
                  autoCapitalize="none"
                />
            </Item>
        );
    }
}

export default InputTextBox;
