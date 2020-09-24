import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { FontAwesome as Icon, SimpleLineIcons as SimpleLineIcon } from '@expo/vector-icons';

import { Link } from 'app/components';
import { trans, priceHelper, unitHelper } from 'app/shared';
import globalStyle from 'app/styles';

export default class CartItem extends React.Component {
  removeCartItem() {
    this.props.onRemove(this.props.data.id);
  }

  onDecrease() {
    let newQuantity = parseInt(this.props.data.quantity) - 1;

    if (newQuantity >= 0) {
      this.onChange(newQuantity);
    }
  }

  onIncrease() {
    let newQuantity = parseInt(this.props.data.quantity) + 1;
    this.onChange(newQuantity);
  }

  onChange(newValue) {
    this.props.onUpdate(this.props.data.id, newValue);
  }

  render() {
    const lang = this.props.lang;
    const { data } = this.props;

    const cartItem = data.item;

    const product = cartItem.product;
    const variant = cartItem.variant;
    const producer = cartItem.producer;

    let currency = producer.currency;
    if (!currency || currency === 'null') {
      currency = '';
    }

    let packageUnit = unitHelper.getPackageUnit(product, variant, this.props.lang);

    let productName = <Text numberOfLines={2} style={styles.productName}>{cartItem.product.name}</Text>;
    let variantName = null;
    let productPrice = priceHelper.getPriceFormatted(product, null, currency);
    let totalPrice = priceHelper.getCalculatedPriceFormatted(product, null, data.quantity, currency, true);

    if (variant) {
      packageUnit = unitHelper.getPackageUnit(product, variant, this.props.lang);

      variantName = <Text style={styles.productName} numberOfLines={1}>{variant.name}</Text>;
      productPrice = priceHelper.getPriceFormatted(product, variant, currency);
      totalPrice = priceHelper.getCalculatedPriceFormatted(product, variant, data.quantity, currency, true);
    }

    if (packageUnit) {
      packageUnit = <Text numberOfLines={1} style={styles.packageUnitText}>{packageUnit}</Text>;
    }

    let quantityPrice = <Text style={styles.quantity}>{data.quantity} á {productPrice}</Text>;

    if (this.props.loading) {
      quantityPrice = (
        <View style={styles.loader}>
          <ActivityIndicator color="#333" />
        </View>
      );
    }

    return (
      <View key={data.ref} style={styles.cartItem}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{cartItem.product_variant_name}</Text>
          <Text style={styles.metadata}>{cartItem.producer.name}</Text>
          {quantityPrice}
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.quantityControl.view}>
            <TouchableOpacity style={styles.quantityControl.button} onPress={this.onDecrease.bind(this)}>
              <SimpleLineIcon name='minus' style={styles.quantityControl.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.quantityControl.button} onPress={this.onIncrease.bind(this)}>
              <SimpleLineIcon name='plus' style={styles.quantityControl.icon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={this.removeCartItem.bind(this)}>
            <Text style={styles.deleteButton}>{trans('Delete', lang)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

let styles = {
  leftColumn: {
    flexShrink: 1,
  },
  rightColumn: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cartItem: {
    borderBottomWidth: 1,
    borderColor: globalStyle.color.red16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 21,
  },
  title: {
    color: globalStyle.color.red,
    fontFamily: 'montserrat-semibold',
    fontSize: 14,
    lineHeight: 22,
  },
  metadata: {
    color: globalStyle.color.black,
    fontFamily: 'montserrat-regular',
    fontSize: 14,
    lineHeight: 22,
  },
  quantity: {
    color: globalStyle.color.black,
    fontFamily: 'montserrat-semibold',
    fontSize: 18,
    lineHeight: 22,
  },
  quantityControl: {
    view: {
      display: 'flex',
      flexDirection: 'row',
    },
    button: {
      marginLeft: 15,
    },
    icon: {
      color: globalStyle.color.lightGrey,
      fontSize: 32,
    },
  },
  deleteButton: {
    color: globalStyle.color.lightGrey,
    fontFamily: 'montserrat-regular',
  },
  loader: {
    alignItems: 'flex-start',
    display: 'flex',
    marginBottom: 2, // Avoid jumpy behaviour
  }
};
