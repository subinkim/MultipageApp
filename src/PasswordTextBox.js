import React from 'react';
import { Item, Input, Icon, Label } from 'native-base';

class PasswordTextBox extends React.Component {
    state = {
        icon: "eye-off",
        password: true
    };

    _changeIcon() {
        this.setState(prevState => ({
            icon: prevState.icon === 'eye' ? 'eye-off' : 'eye',
            password: !prevState.password
        }));
    }

    render() {
        const { label, icon, onChange } = this.props;
        return (
            <Item>
                <Icon active name={icon} />
                <Input secureTextEntry={this.state.password} placeholder = { label } onChangeText={(e) => onChange(e)} returnKeyType='done' />
                <Icon name={this.state.icon} onPress={() => this._changeIcon()} />
            </Item>
        );
    }
}

export default PasswordTextBox;
