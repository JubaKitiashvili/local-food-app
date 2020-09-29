import React, { Component } from 'react';
import { ScrollView, RefreshControl, View, Text, ActivityIndicator } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import globalStyle from 'app/styles';

class Empty extends Component {
  onRefresh() {
    this.props.onRefresh();
  }

  render() {
    let refreshControl = null;
    let refreshing = this.props.refreshing || false;

    if (this.props.onRefresh) {
      refreshControl = <RefreshControl
        onRefresh={this.onRefresh.bind(this)}
        refreshing={false}
        tintColor={globalStyle.color.iosLightGrey}
        color={globalStyle.color.iosLightGrey}
      />;
    }

    let icon = null;
    if (this.props.icon) {
      let iconContent = <Icon style={styles.icon} name={this.props.icon} />;

      if (refreshing) {
        iconContent = <ActivityIndicator color={globalStyle.color.white} />
      }

      icon = (
        <View style={styles.iconWrapper}>
          {iconContent}
        </View>
      );
    } else {

    }

    return (
      <ScrollView refreshControl={refreshControl} contentContainerStyle={{flex: 1}}>
        <View style={styles.view}>
          <View style={styles.content}>
            {icon}
            <Text style={styles.header}>{this.props.header}</Text>
            <Text style={styles.text}>{this.props.text}</Text>
          </View>
          <View style={styles.action}>
            {this.props.action}
          </View>
        </View>
      </ScrollView>
    );
  }
}

let styles = {
  view: {
    backgroundColor: globalStyle.color.white,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  content: {
    alignItems: 'center',
  },
  action: {
    marginTop: 32,
  },
  iconWrapper: {
    alignItems: 'center',
    backgroundColor: globalStyle.color.red,
    borderRadius: 200,
    height: 100,
    justifyContent: 'center',
    marginBottom: 15,
    width: 100,
  },
  icon: {
    color: globalStyle.color.white,
    fontSize: 48,
  },
  header: {
    color: globalStyle.color.black,
    fontFamily: 'montserrat-semibold',
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    color: globalStyle.color.black,
    fontSize: 14,
    fontFamily: 'montserrat-regular',
    margin: 5,
    textAlign: 'center',
  }
};

export default Empty;
