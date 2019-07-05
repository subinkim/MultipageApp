import React from 'react';
import { Item, Input, Icon, Label } from 'native-base';

class SSIDTextBox extends React.Component {
    state = {
        ssid: "",
        icon: "wifi",
    };
    render() {
        const { label, onChange } = this.props;
        return (
            <Item>
                <Icon active name={ this.state.icon } />
                <Input placeholder = { label } onChangeText={(e) => onChange(e)} />
            </Item>
        );
    }
}

export default SSIDTextBox;
