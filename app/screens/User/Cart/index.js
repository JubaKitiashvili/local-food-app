import React from 'react';
import { connect } from 'react-redux';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import _ from 'lodash';
import { Alert, Loader, Button2, Empty, ListSection } from 'app/components';
import CartItem from './components/CartItem';
import * as actions from './actions';
import { trans, priceHelper } from 'app/shared';
import globalStyle from 'app/styles';

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.fetchCart();
  }

  componentDidUpdate(prevProps, prevState) {
    this.fetchCart();
  }

  fetchCart(refresh) {
    if (this.props.cart.cart === undefined || refresh) {
      this.props.dispatch(actions.fetchCart(refresh));
    }
  }

  removeCartItem(id) {
    this.props.dispatch(actions.removeCartItem(id, this.props.system.lang));
  }

  updateCartItem(id, quantity) {
    this.props.dispatch(actions.updateCartItem(id, quantity, this.props.system.lang));
  }

  createOrder() {
    this.props.dispatch(actions.createOrder(this.props.system.lang));
  }

  navigateToOrders() {
    this.props.navigation.navigate('UserStackNavigation');
  }

  groupCartDateItemLinksByDate(cartDateItemLinks) {
    let groupedCartDateItemLinks = [];

    for (let i = 0; i < cartDateItemLinks.length; i++) {
      let cartDateItemLink = cartDateItemLinks[i];
      let cartDate = cartDateItemLink.date;
      let key = moment(cartDate.date.date).format('YYYYMMDD');

      // Check if key exists
      let index = _.findIndex(groupedCartDateItemLinks, function(o) {
        return o.key == key;
      });

      if (index === -1) {
        groupedCartDateItemLinks.push({
          key: key,
          items: [],
        });

        // Set index
        index = groupedCartDateItemLinks.length - 1;
      }

      groupedCartDateItemLinks[index].items.push(cartDateItemLink);
    }

    return groupedCartDateItemLinks;
  }

  renderCartItems(cart) {
    let cartDateItemLinksByDate = this.groupCartDateItemLinksByDate(cart);

    return cartDateItemLinksByDate.map(cartDateItemLinks => {
      let m = moment(cartDateItemLinks.key);
      let date = m.format('DD') + ' ' + trans(m.format('MMMM'), this.props.system.lang) + ' ' + m.format('YYYY');

      const { updatingCartItems } = this.props.cart;

      let cartItems = cartDateItemLinks.items.map(cartDateItemLink => {
        let loading = updatingCartItems.indexOf(cartDateItemLink.id) !== -1;
        let cartItemProps = {
          key: cartDateItemLink.id,
          data: cartDateItemLink,
          loading: loading,
          onRemove: this.removeCartItem.bind(this),
          onUpdate: this.updateCartItem.bind(this)
        }

        return <CartItem {...cartItemProps} lang={this.props.system.lang} />;
      });

      return (
        <View key={cartDateItemLinks.key}>
          <Text style={styles.date}>{trans('Pickup', this.props.system.lang)} {date}</Text>
          {cartItems}
        </View>
      )
    });
  }

  render() {
    const { loading, refreshing, cart, updatingCartItems } = this.props.cart;
    const lang = this.props.system.lang;
    moment.locale(lang);

    if (loading) {
      return (
        <View style={{flex: 1, backgroundColor: globalStyle.backgroundColor}}>
          <Loader />
        </View>
      );
    }

    if (this.props.cart.created) {
      let action = <Button title={trans('View orders', lang)} onPress={this.navigateToOrders.bind(this)} />;

      return (
        <View style={{flex: 1, backgroundColor: globalStyle.backgroundColor}}>
          <Empty icon="shopping-cart" header={trans('Created!', lang)} text={trans('Your order is created.', lang)} action={action} />
        </View>
      );
    }

    if (!refreshing && _.isEmpty(cart)) {
      return (
        <View style={{flex: 1, backgroundColor: globalStyle.color.white}}>
          <Empty icon="shopping-cart" header={trans('Shopping cart is empty', lang)} text={trans('Visit a node to find available products.', lang)} />
        </View>
      );
    }

    let totalCost = _.chain(cart)
    .groupBy(cartDateItemLink => {
      let item = cartDateItemLink.item;
      return item.producer.currency;
    })
    .mapValues((cartDateItemLinks, currency) => {
      return _.sumBy(cartDateItemLinks, (cartDateItemLink) => {
        let item = cartDateItemLink.item;
        let price = priceHelper.getCalculatedPrice(item.product, item.variant, cartDateItemLink.quantity);

        return price;
      });
    })
    .map((total, currency) => {
      if (!currency || currency === 'null') {
        currency = '';
      }

      return <Text style={styles.orderText} key={currency}>{total} {currency}</Text>;
    })
    .value();

    let items = this.renderCartItems(cart);

    let message = null;
    if (!this.props.auth.user.active) {
      message = (
        <Alert type="warning" title="" message={trans('You need to verify your email address before you can order.', lang)} />
      );
    }

    if (this.props.auth.user.membership_payments.length === 0) {
      message = (
        <Alert type="warning" title={trans('Support the future of food', lang)} message={trans('Local Food Nodes is funded by donations, amount free of choice. Your donation is valid for a year. \r\r Welcome to Local Food Nodes and thank you for supporting small-scale food production without intermediaries.\r\r#letsgolocal', lang)} />
      );
    }

    let header = (
      <View style={styles.headerView}>
        <Text style={styles.headerText}>{totalCost}</Text>
      </View>
    );

    let productCounter = (
      <View style={styles.productCounterView}>
        <Text style={styles.productCounterText}>{cart.length} {cart.length > 1 ? trans('products', lang) : trans('product', lang)}</Text>
      </View>
    );

    return (
      <View style={{flex: 1, backgroundColor: globalStyle.color.white}}>
        {header}
        {productCounter}
        <ScrollView style={{paddingHorizontal: 15}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.fetchCart.bind(this, true)} />}>
          {message}
          {items}
          <View style={{marginTop: 30}}>
            <Button2 type="warning" loading={this.props.cart.creating} title={trans('Send order', lang)} onPress={this.createOrder.bind(this)} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { auth, cart, system } = state;

  return {
    auth,
    cart,
    system,
  };
}

export default connect(mapStateToProps)(Cart);

let styles = {
  headerView: {
    alignItems: 'center',
    backgroundColor: globalStyle.color.red,
    paddingBottom: 32,
  },
  headerText: {
    color: '#fff',
    fontFamily: 'montserrat-regular',
    fontSize: 20,
  },
  productCounterView: {
    alignItems: 'center',
    backgroundColor: globalStyle.color.beige,
    padding: 12,
  },
  productCounterText: {
    color: '#000',
    fontFamily: 'montserrat-regular',
    fontSize: 16,
  },
  date: {
    color: globalStyle.color.black,
    fontFamily: 'montserrat-semibold',
    fontSize: 16,
    marginVertical: 32,
  }
};
