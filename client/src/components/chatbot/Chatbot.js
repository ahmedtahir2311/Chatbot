import React, { Component } from 'react';
import axios from 'axios/index';
import Cookies from  'universal-cookie';
import {v4 as uuid} from 'uuid';
import Message from './Message';
import Card from './Card';
import QuickReplies from './QuickReplies';
// import {Link} from 'react-router-dom';


const cookies = new Cookies();

class Chatbot extends Component {
    messagesEnd;
    talkInput;
    constructor(props) {
        super(props);      
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);   // This binding is necessary to make 'this' work in the callback
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);

        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);

        this.state = {
            messages: [],
            showBot: true
        };
        if (cookies.get('userID') === undefined) {
            cookies.set( 'userID', uuid(), { path: '/'});
        }
        console.log(cookies.get('userID'));
    }

async df_text_query(text) {
    let msg;
    let says = {
        speaks: 'user',
        msg: {
            text: {
                text: text
            }
        }
    }
    this.setState({ messages: [...this.state.messages, says]});
    try {
        const res = await axios.post('/api/df_text_query', {text, userID: cookies.get('userID')});

        if(res.data.fulfillmentMessages ) {
            for (let i = 0; i < res.data.fulfillmentMessages.length; i++) {         
                msg = res.data.fulfillmentMessages[i];
                says = {
                    speaks: 'bot',
                    msg: msg
                }
                this.setState({ messages: [...this.state.messages, says]});
            }
        } 
    } catch (e) {
        says = {
            speaks: 'bot',
            msg: {
                text : {
                    text: "I'm having troubles. I need to terminate. will be back later"
                }
            }
        }
        
        this.setState({ messages: [...this.state.messages, says]});
        let that = this;
        setTimeout(function(){
            that.setState({ showBot: false})
        }, 2000);
    }    
};

async df_event_query(event) {
    try {
        const res = await axios.post('/api/df_event_query', {event, userID: cookies.get('userID')});
        let msg, says = {};

        if (res.data.fulfillmentMessages ) {
            for (let i = 0; i < res.data.fulfillmentMessages.length; i++) {
                msg = res.data.fulfillmentMessages[i];
                says = {
                    speaks: 'bot',
                    msg: msg
                }
                this.setState({ messages: [...this.state.messages, says]});
            }
        }
    } catch (e) {
        let says = {
            speaks: 'bot',
            msg: {
                text : {
                    text: "I'm having troubles. I need to terminate. Please Refresh App"
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says]});
        let that = this;
        setTimeout(function(){
            that.setState({ showBot: false})
        }, 2000);
    }  
};

    resolveAfterXSeconds(x) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(x);
            }, x * 1000);
        })
    }

    componentDidMount() {
        this.df_event_query('Login');
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behaviour: "smooth" });
        if ( this.talkInput ) {
        this.talkInput.focus();
        }
    }

    show(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({showBot: true});
    }

    hide(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({showBot: false});
    }

    _handleQuickReplyPayload(event, payload, text) {
       event.preventDefault();
        event.stopPropagation();

        switch (payload) {
            case "training_masterclass":
                this.df_event_query('MASTERCLASS');
                break;
            default:
                this.df_text_query(text);
                break;
        } 
    
    }
 
    renderCards(cards) {
        return cards.map((card, i) => <Card key={i} payload={card.structValue}/>);
    }

    renderOneMessage(message, i) {
        if (message.msg && message.msg.text && message.msg.text.text) {
            return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
        } else  if(message.msg && message.msg.payload.fields.cards) {
           return <div key={i}>
               <div className="card-panel grey lighten-5 z-depth-1"> 
               <div style={{overflow: 'hidden'}}>
               <div className="col s2">
                    <button className="btn-floating btn-large waves-effect waves-light teal lighten-2">{message.speaks}</button>
                </div>
                <div style={{overflow: 'auto', overflowY:'scroll'}}>
                    <div style={{ height:300, width:message.msg.payload.fields.cards.listValue.values
                    .length * 270}}>
                        {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                    </div>

                </div>
               </div>
               </div>
           </div>
        } else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields &&
            message.msg.payload.fields.quick_replies
        )   {
                return <QuickReplies
                text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                key={i}
                replyClick={this._handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.quick_replies.listValue.values}></QuickReplies>;
            }
    }

    renderMessages(stateMessages) {
        if (stateMessages) {
            return stateMessages.map((message, i) => {
                return this.renderOneMessage(message, i);             
                //  return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
            });
        } else {
            return null;
        }
    }

    _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }
// above ul <h6 style={{fontSize:24,  fontFamily: 'copper black'}}>Chatbot Alexa</h6>  
//  <button href="/" className="brand-logo">Chatbot Alexa</button>  // in ul id="nav-mobile" 
    render() {
        if (this.state.showBot) {
        return (
            <div style={{ minheight:500, maxheight:500, width:400, position: 'fixed', bottom: 0, right:0, border: '1px solid lightgrey' }}>
                <nav>
                <div className="nav-wrapper" style={{backgroundColor:"#175071"}}>  
                    <button class="btn waves-effect waves-light" style={{backgroundColor:"#4DB6AC"}} type="submit" name="action">Alexa</button>       
                        <ul className="right hide-on-med-and-down">
                        <li><a href="/" onClick={this.hide}>Close</a></li>
                        </ul>
                    </div>
                </nav>
                <div id="chatbot" style={{ height: 388, width: '100%', overflow: 'auto', backgroundColor:" #ffffff"}}>                   
                    {this.renderMessages(this.state.messages)}
                    <div ref={(el) => {this.messagesEnd = el; }}                   
                    style={{ float: 'left', clear: 'both' }}>
                    </div>
                </div>
                <div className="col s12" >    
                <input style={{margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}} ref={(input) => { this.talkInput = input; }} placeholder="Ask Here:"  onKeyPress={this._handleInputKeyPress} id="user_says" type="text" />
                </div>
            </div>
        );
    }   else {
            return (
                <div style={{ minheight:40, maxheight:500, width:400, position: 'fixed', bottom: 0, right:0, border: '1px solid lightgrey' }}>
                    <nav>
                    <div className="nav-wrapper" style={{backgroundColor:"#175071"}}>
                        <button class="btn waves-effect waves-light" style={{backgroundColor:"#4DB6AC"}}  type="submit" name="action">Alexa</button>
                            <ul className="right hide-on-med-and-down">
                            <li><a href="/" onClick={this.show}>ShowBot</a></li>
                            </ul>
                        </div>
                    </nav>
                    <div ref={(el) => {this.messagesEnd = el; }}                   
                    style={{ float: 'left', clear: 'both' }}>
                    </div>
                </div>
            );

        }
    }

}

export default Chatbot;
