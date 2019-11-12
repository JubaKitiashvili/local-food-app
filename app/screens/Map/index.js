import React from 'react';
import { connect } from 'react-redux';
import { View, SafeAreaView } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';

import { ScreenHeader } from 'app/components';
import MapViewWrapper from './components/MapViewWrapper';
import NodesScreen from 'app/screens/User/screens/Nodes';
import { trans } from 'app/shared';
import globalStyle from 'app/styles';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMap: false,
    };
    if (props.auth && props.auth.user) {
      this.props.navigation.setParams({ title: trans('your_nodes', this.props.lang), leftOnPress: this.toggleMap, icon: 'globe'})
    } else {
      this.props.navigation.setParams({ title: trans('find_nodes', this.props.lang), leftOnPress: this.toggleMap, icon: 'list'})
    }
  }

  toggleMap = () => {
    if (!this.state.showMap) {
      this.props.navigation.setParams({ title: trans('find_nodes', this.props.lang), icon: 'list'})
    } else {
      this.props.navigation.setParams({ title: trans('your_nodes', this.props.lang), icon: 'globe'})
    }
    this.setState({showMap: !this.state.showMap});
    
  }

  updateTitle(title) {
    
    if (title !== this.props.navigation.getParam('title', '')) {
      console.log(title);
      // this.props.navigation.setParams({ title: trans(title, this.props.lang)})
    }
  }

  render() {
    let left;

    if (this.props.auth && this.props.auth.user) {
      if (this.state.showMap) { // Show map
        left = <Icon style={styles.leftIcon} name='list' size={24} color='#fff' onPress={this.toggleMap.bind(this)}/>;
        // this.props.navigation.setParams({ title: trans('find_nodes', this.props.lang)})
        // this.updateTitle('find_nodes')
        return (
          <SafeAreaView style={{flex: 1, backgroundColor: globalStyle.primaryColor}}>
            {/* <ScreenHeader title={trans('find_nodes', this.props.lang)} right left={left} navigation={this.props.navigation} /> */}
            <MapViewWrapper {...this.props} lang={this.props.lang} />
          </SafeAreaView>
        );
      } else { // Show user nodes
        left = <Icon style={styles.leftIcon} name='globe' size={24} color='#fff' onPress={this.toggleMap.bind(this)}/>;
        // this.props.navigation.setParams({ title: trans('your_nodes', this.props.lang)})
        // this.updateTitle('your_nodes')
        return (
          <SafeAreaView style={{flex: 1, backgroundColor: globalStyle.primaryColor}}>
            {/* <ScreenHeader title={trans('your_nodes', this.props.lang)} right left={left} navigation={this.props.navigation} /> */}
            <NodesScreen toggleMap={this.toggleMap.bind(this)} lang={this.props.lang} navigation={this.props.navigation}/>
          </SafeAreaView>
        );
      }
    } else { // Show map when user is not logged in
      // this.props.navigation.setParams({ title: trans('find_nodes', this.props.lang)})
      // this.updateTitle('find_nodes')
      return (
        <SafeAreaView style={{flex: 1, backgroundColor: globalStyle.primaryColor}}>
          {/* <ScreenHeader title={trans('find_nodes', this.props.lang)} navigation={this.props.navigation} /> */}
          <MapViewWrapper {...this.props} lang={this.props.lang} />
        </SafeAreaView>
      );
    }
  }
}

function mapStateToProps(state) {
  const { map, auth } = state;

  return {
    map,
    auth
  }
}

Map.defaultProps = {
  map: {
    nodes: null,
    location: null
  }
};

let styles = {
  calloutHeader: {
    fontWeight: 'bold',
  },
};

export default connect(mapStateToProps)(Map);
