import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import styleMerger from 'app/shared/utils/styleMerger';
import { trans } from 'app/shared';

export default class TextInputComponent extends React.Component {
  render() {
    let mergedStyles = styleMerger.merge(styles, this.props.style);

    let secureTextEntry = this.props.secureTextEntry || false;

    let label = null;
    let hint = null;
    let icon = null;
    if (this.props.hint) {
      hint = <Text style={mergedStyles.hint}>{this.props.hint}</Text>
    }

    if (this.props.label) {
      label = <Text style={mergedStyles.label}>{this.props.label}</Text>;
    }

    if (this.props.toggleViewPassword && !this.props.secureTextEntry) {
      if (this.props.viewPassword) {
        secureTextEntry = false;
        icon = (
          <TouchableOpacity onPress={this.props.toggleViewPassword}>
            <Text style={styles.icon}>{trans('Hide password', this.props.lang)}</Text>
          </TouchableOpacity>
        );
      } else {
        secureTextEntry = true;
        icon = (
          <TouchableOpacity onPress={this.props.toggleViewPassword}>
            <Text style={styles.icon}>{trans('Show password', this.props.lang)}</Text>
          </TouchableOpacity>
        );
      }
    }

    return (
      <View style={mergedStyles.wrapper}>
        <View style={styles.labelRow}>
          {label}
          {icon}
        </View>
        <TextInput {...this.props} secureTextEntry={secureTextEntry} style={mergedStyles.textInput} underlineColorAndroid='transparent' placeholderTextColor={mergedStyles.placeholderColor} />
        {hint}
      </View>
    );
  }
}

let styles = {
  wrapper: {
    flex: 1,
    marginBottom: 15,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    marginBottom: 5,
    fontFamily: 'montserrat-semibold',
    color: '#fff',
  },
  textInput: {
    backgroundColor: '#fff',
    elevation: 0,
    fontFamily: 'montserrat-regular',
    paddingHorizontal: 15,
    paddingVertical: 15,
    textDecorationLine: 'none',
  },
  placeholderColor: '#666',
  hint: {
    color: '#fff',
    fontFamily: 'montserrat-regular',
    fontSize: 12,
    marginTop: 3,
  },
  icon: {
    color: '#fff',
    fontSize: 12,
  }
};
