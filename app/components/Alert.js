import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import globalStyle from 'app/styles';

export default class Alert extends React.Component {
  render() {
    let icon = null;
    let iconView = null;

    if (this.props.icon) {
      icon = <Icon style={styles.icon} name={this.props.icon} />;
    } else {
      if (this.props.type === 'success') {
        icon = <Icon style={styles.icon} name="thumbs-up" />;
      } else if (this.props.type === 'warning') {
        icon = <Icon style={styles.icon} name="warning" />;
      } else if (this.props.type === 'danger') {
        icon = <Icon style={styles.icon} name="times-circle" />;
      } else {
        icon = <Icon style={styles.icon} name="info-circle" />;
      }
    }

    if (icon) {
      iconView = <View style={[styles.iconView, styles.iconView[this.props.type]]}>{icon}</View>;
    }

    let title = null;
    if (this.props.title) {
      title = <Text style={styles.title}>{this.props.title}</Text>
    }

    return (
      <View style={[styles.view, styles.view[this.props.type]]}>
        {iconView}
        <View style={{padding: 16, flexShrink: 1}}>
          {title}
          <Text style={[styles.text, styles.text[this.props.type]]}>{this.props.message}</Text>
        </View>
      </View>
    );
  }
}

let styles = {
  view: {
    alignItems: 'center',
    backgroundColor: globalStyle.color.white,
    borderColor: globalStyle.color.black,
    borderWidth: 1,
    color: globalStyle.color.black,
    flexDirection: 'row',
    marginVertical: 15,
    success: {
      borderColor: globalStyle.color.green,
    },
    warning: {
      borderColor: globalStyle.color.orange,
    },
    danger: {
      borderColor: globalStyle.color.red,
    }
  },
  icon: {
    color: globalStyle.color.white,
    fontSize: 32,
    flex: 1,
  },
  iconView: {
    backgroundColor: globalStyle.color.black,
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    success: {
      backgroundColor: globalStyle.color.green,
    },
    warning: {
      backgroundColor: globalStyle.color.orange,
    },
    danger: {
      backgroundColor: globalStyle.color.red,
    }
  },
  title: {
    fontFamily: 'montserrat-semibold',
    marginBottom: 10,
  },
  text: {
    color: '#000',
    fontFamily: 'montserrat-regular',
  }
};
