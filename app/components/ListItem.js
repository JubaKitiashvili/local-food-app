import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import styleMerger from 'app/shared/utils/styleMerger';
import globalStyle from 'app/styles';

export default class ListItem extends React.Component {
  render() {
    let mergedStyles = styleMerger.merge(styles, this.props.style);

    let columns = React.Children.map(this.props.children, (column, index) => {
      return React.cloneElement(column, {
        style: mergedStyles.column
      });
    });

    let navigationArrow = null;
    if (this.props.onPress) {
      navigationArrow = <Icon style={styles.chevron} name="chevron-right" />;
    }

    let isLastItem = this.props.last || false;

    return (
      <TouchableOpacity onPress={this.props.onPress} style={[mergedStyles.listItem, isLastItem && mergedStyles.lastListItem]}>
        {columns}
        {navigationArrow}
      </TouchableOpacity>
    );
  }
}

let styles = {
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: globalStyle.backgroundColor,
  },
  lastListItem: {
    borderBottomWidth: 0,
    marginBottom: 15,
  },
  column: {
    marginHorizontal: 15,
  },
  chevron: {
    marginRight: 5,
    color: '#333',
    alignSelf: 'center',
  }
};
