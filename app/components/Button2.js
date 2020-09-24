import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import globalStyle from 'app/styles';

export default class ButtonComponent extends React.Component {
  render() {
    let title = null;
    let icon = null;
    let onPress = this.props.onPress;

    // Title
    if (this.props.title) {
      let titleStyle = [
        styles.title.default,
        this.props.outline ? styles.title.outline[this.props.type] : styles.title.solid[this.props.type]
      ];
      title = <Text style={titleStyle}>{this.props.title.toUpperCase()}</Text>;
    }

    // Icon
    if (this.props.icon) {
      let iconStyle = [
        styles.icon.default,
        this.props.outline ? styles.icon.outline[this.props.type] : styles.icon.solid[this.props.type]
      ];
      icon = <Icon style={iconStyle} name={this.props.icon} />;
    }

    // Button
    let buttonStyle = [
      styles.button.default,
      styles.button[this.props.type],
      this.props.outline ? styles.button.outline[this.props.type] : styles.button.solid[this.props.type],
      this.props.disabled || this.props.loading ? styles.disabled : null,
    ];

    // Disabled state
    if (this.props.loading) {
      onPress = null;
    } else if (this.props.disabled) {
      icon = <Icon style={styles.icon} name='ban' />;
      onPress = null;
    }

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
          {icon}
          {title}
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={buttonStyle}>
          {icon}
          {title}
        </View>
      );
    }
  }
}

let styles = {
  button: {
    default: {
      borderColor: globalStyle.color.black,
      borderRadius: 100,
      borderWidth: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 8,
    },
    outline: {
      danger: {
        borderColor: globalStyle.color.red,
      },
      success: {
        borderColor: globalStyle.color.green,
      },
      warning: {
        borderColor: globalStyle.color.orange,
      },
    },
    solid: {
      danger: {
        backgroundColor: globalStyle.color.red,
        borderColor: globalStyle.color.red,
      },
      success: {
        backgroundColor: globalStyle.color.green,
        borderColor: globalStyle.color.green,
      },
      warning: {
        backgroundColor: globalStyle.color.orange,
        borderColor: globalStyle.color.orange,
      },
    }
  },
  icon: {
    default: {
      alignSelf: 'center',
      color: globalStyle.color.black,
      fontSize: 12,
      paddingRight: 5,
    },
    outline: {
      danger: {
        color: globalStyle.color.red,
      },
      success: {
        color: globalStyle.color.green,
      },
      warning: {
        color: globalStyle.color.orange,
      }
    },
    solid: {
      danger: {
        color: globalStyle.color.white,
      },
      success: {
        color: globalStyle.color.white,
      },
      warning: {
        color: globalStyle.color.black,
      }
    }
  },
  title: {
    default: {
      color: globalStyle.color.black,
      fontFamily: 'montserrat-semibold',
      fontSize: 14,
      lineHeight: 18,
      paddingVertical: 19,
      textAlign: 'center',
    },
    outline: {
      danger: {
        color: globalStyle.color.red,
      },
      success: {
        color: globalStyle.color.green,
      },
      warning: {
        color: globalStyle.color.orange,
      }
    },
    solid: {
      danger: {
        color: globalStyle.color.white,
      },
      success: {
        color: globalStyle.color.white,
      },
      warning: {
        color: globalStyle.color.black,
      }
    }
  },
  disabled: {
    opacity: 0.5,
  },
};
