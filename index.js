import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// Slomux — упрощённая, сломанная реализация Flux.
// Перед вами небольшое приложение, написанное на React + Slomux.
// Это нерабочий секундомер с настройкой интервала обновления.

// Исправьте ошибки и потенциально проблемный код, почините приложение и прокомментируйте своё решение.

// При нажатии на "старт" должен запускаться секундомер и через заданный интервал времени увеличивать свое значение на значение интервала
// При нажатии на "стоп" секундомер должен останавливаться и сбрасывать свое значение

const createStore = (reducer, initialState) => {
    let currentState = initialState
    const listeners = []
  
    const getState = () => currentState
    const dispatch = action => {
      currentState = reducer(currentState, action)
      listeners.forEach(listener => listener())
    }
  
    const subscribe = listener => listeners.push(listener)
  
    return { getState, dispatch, subscribe }
  }
  
  const connect = (mapStateToProps, mapDispatchToProps) =>
    Component => {
      class WrappedComponent extends React.Component {

        render() {
          return (
            <Component
              {...this.props}
              {...mapStateToProps(this.context.store.getState(), this.props)}
              {...mapDispatchToProps(this.context.store.dispatch, this.props)}
            />
          )
        }
  
        componentDidMount() { // === 2
          this.context.store.subscribe(this.handleChange)
        }
  
        handleChange = () => {
          this.forceUpdate()
        }
      }
  
      WrappedComponent.contextTypes = {
        store: PropTypes.object,
      }
  
      return WrappedComponent
    }
  
  class Provider extends React.Component {
    getChildContext() {
      return {
        store: this.props.store,
      }
    }
    
    render() {
      return React.Children.only(this.props.children)
    }
  }
  
  Provider.childContextTypes = {
    store: PropTypes.object,
  }
  
  // APP
  
  // actions
  const CHANGE_INTERVAL = 'CHANGE_INTERVAL'
  
  // action creators
  const changeInterval = value => ({
    type: CHANGE_INTERVAL,
    payload: value,
  })
  
  
  // reducers
  const reducer = (state, action) => {
    switch(action.type) {
      case CHANGE_INTERVAL:
        const newState = state + action.payload
        return newState < 0 ? state : newState // === 9
      default:
        return state // === 8
    }
  }
  
  // components
  
  class IntervalComponent extends React.Component {
    render() {
      return (
        <div>
          <span>Интервал обновления секундомера: {this.props.currentInterval} сек.</span>
          <span>
            <button onClick={() => this.props.changeInterval(-1)}>-</button>
            <button onClick={() => this.props.changeInterval(1)}>+</button>
          </span>
        </div>
      )
    }
  }
  
  const Interval = connect(state => ({ // === 1
    currentInterval: state,
  }),
  dispatch => ({
    changeInterval: value => dispatch(changeInterval(value)),
  }),
  )(IntervalComponent)
  
  class TimerComponent extends React.Component {
    state = {
      currentTime: 0
    }
  
    render() {
      return (
        <div>
          <Interval />
          <div>
            Секундомер: {this.state.currentTime} сек.
          </div>
          <div>
            <button onClick={this.handleStart}>Старт</button>
            <button onClick={this.handleStop}>Стоп</button>
          </div>
        </div>
      )
    }
  
    handleStart = () => { // === 3
        
      setInterval(this.setTime, this.props.currentInterval*1000) // === 4,6
    }
    
    setTime = () => { // === 5
        this.setState({
            currentTime:  this.state.currentTime + this.props.currentInterval,
        });
    }
    
    handleStop = () => { // === 3
      clearInterval(this.setTime); // === 5
      this.setState({ currentTime: 0 })
    }
  }
  
  const Timer = connect(state => ({
    currentInterval: state,
  }), () => {})(TimerComponent)
  
  // init
  ReactDOM.render(
    <Provider store={createStore(reducer, 0)}> // === 7
      <Timer />
    </Provider>,
    document.getElementById('app')
  )
  
