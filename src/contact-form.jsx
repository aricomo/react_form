'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var createClass = require('create-react-class');

//create ContactForm Class as Component including render method
var ContactForm = createClass({
  /**
   * Sets the default state of this component.
   * https://facebook.github.io/react/docs/component-specs.html#getinitialstate
   * https://reactjs.org/docs/react-without-es6.html
   * Setting the Initial State
   */
  getInitialState: function() {
    return {
      type: 'info',
      message: ''
    };
  },
  /**
   * Form submission callback.
   */
  handleSubmit: function (event) {
    event.preventDefault();
    // Scroll to the top of the page to show the status message.
    document.getElementById('heading').scrollIntoView();
    this.setState({ type: 'info', message: 'Sending...' }, this.sendFormData);
  },
  /**
   * Submits form data to the web server.
   */
  sendFormData: function () {
    // Prepare form data for submitting it.
    var formData = {
      budget: ReactDOM.findDOMNode(this.refs.budget).value,
      company: ReactDOM.findDOMNode(this.refs.company).value,
      email: ReactDOM.findDOMNode(this.refs.email).value,
      name: ReactDOM.findDOMNode(this.refs.name).value,
      phone: ReactDOM.findDOMNode(this.refs.phone).value,
      project: ReactDOM.findDOMNode(this.refs.project).value,
      referal: ReactDOM.findDOMNode(this.refs.referal).value,
      website: ReactDOM.findDOMNode(this.refs.website).value
    };

    // Extract checked values from "How can we help?" and "How soon do we need to start?".
    formData.areas = this.getSelected('areas');
    formData.when = this.getSelected('when');

    // Send the form data.
    var xmlhttp = new XMLHttpRequest();
    var _this = this;
    //onreadystatechangeとはreadyState(0~4) の値が変わるたびに、自動的に呼ばれる関数（または関数名）を格納します.
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {//4: リクエストが終了し、レスポンスの準備が完了しました.
      console.log("here is xmlhttp.responseText"+xmlhttp.responseText)
        var response = JSON.parse(xmlhttp.responseText);
        if (xmlhttp.status === 200 && response.status === 'OKOK') {
        console.log('Success! this is xmlhttp.status status'+xmlhttp.status);
          _this.setState({ type: 'success', message: 'We have received your message and will get in touch shortly. Thanks!' });
        }
        else {
        console.log('this is error xmlhttp.status status'+xmlhttp.status + 'response.status'+response.status);
          _this.setState({ type: 'danger', message: 'Sorry, there has been an error. Please try again later or send us an email at info@example.com.' });
        }
      }
      console.log('this is xmlhttp.readyState' +xmlhttp.readyState);
    };
    xmlhttp.open('POST', '/send', true);//リクエストします。post to url /send directory async true　for example open(method,url,async)
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //send(string)サーバへリクエストを送信します. 引数は POST リクエストの場合に使用します.
    xmlhttp.send(this.requestBuildQueryString(formData));
  },//sendFormData end
  /**
   * Transforms an object into a URL querystring.
   *
   * @param object params
   * @return string the formatted querystring.
   */
  requestBuildQueryString: function (params) {
    var queryString = [];
    for(var property in params)
      if (params.hasOwnProperty(property)) {
        queryString.push(encodeURIComponent(property) + '=' + encodeURIComponent(params[property]));
      }
      console.log(queryString.join('&'));
    return queryString.join('&');
  },
  /**
   * Extracts selected values from checkboxes and radios.
   *
   * @param string fieldName
   * @return string the selected value(s).
   */
  getSelected: function (fieldName) {
    var i;
    var fields = document.getElementsByName(fieldName);
    var selectedFields = [];
    for (i = 0; i < fields.length; i++) {
      if (fields[i].checked === true) {
        selectedFields.push(fields[i].value);
      }
    }
    return selectedFields.join(', ');
  },
  /**
   * Renders the component.
   * https://facebook.github.io/react/docs/component-specs.html#render
   */
  render: function() {
    if (this.state.type && this.state.message) {
      var classString = 'alert alert-' + this.state.type;
      var status = <div id="status" className={classString} ref="status">
                     {this.state.message}
                   </div>;
    }
    return (
      <div>
        <h1 id="heading">React contact form example: Tell us about your project</h1>
        <p>This is the companion application for an article on <a href="https://www.lullabot.com/articles/processing-forms-in-react" target="_blank">Processing Forms in React</a>.</p>
        <p>The application contains a sample contact form powered by <a href="https://facebook.github.io/react/" target="_blank"> React</a>,
           an <a href="https://www.lullabot.com/articles/what-is-an-isomorphic-application" target="_blank">isomorphic</a> library built by Facebook. The form submission
           is handled by a <a href="https://nodejs.org/" target="_blank">Node.js</a> application written with <a href="http://expressjs.com/" target="_blank">Express</a>.</p>
        {status}
        <form action="" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your full name *</label>
            <input className="form-control" name="name" ref="name" required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your email address *</label>
            <input className="form-control" name="email" ref="email" required type="email" />
          </div>
          <div className="form-group">
            <label htmlFor="company">Your company *</label>
            <input className="form-control" name="company" ref="company" required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Your phone number *</label>
            <input className="form-control" name="phone" ref="phone" required type="phone" />
          </div>
          <div className="form-group">
            <label htmlFor="website">Project website URL</label>
            <input className="form-control" name="website" ref="website" type="url" />
          </div>

          <h3>How can we help&#63; *</h3>
          <div className="form-group">
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Strategy" />Strategy</label>
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="UX Design" />UX Design</label>
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Development" />Development</label>
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Mentorship Consulting" />Mentorship Consulting</label>
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Training" />Training</label>
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Other" />Other</label>
          </div>

          <h3>How soon do we need to start&#63; *</h3>
          <div className="form-group">
            <label className="radio-inline"><input name="when" ref="when" type="radio" value="Immediately" /><span>Immediately</span></label>
            <label className="radio-inline"><input name="when" ref="when" type="radio" value="1-3 months" /><span>1-3 months</span></label>
            <label className="radio-inline"><input name="when" ref="when" type="radio" value="3-6 months" /><span>3-6 months</span></label>
            <label className="radio-inline"><input name="when" ref="when" type="radio" value="6-9 months" /><span>6-9 months</span></label>
            <label className="radio-inline"><input name="when" ref="when" type="radio" value="9-12 months" /><span>9-12 months</span></label>
            <label className="radio-inline"><input name="when" ref="when" type="radio" value="Not sure" /><span>Not sure</span></label>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Give us a rough idea of your budget *</label>
            <input className="form-control" name="budget" ref="budget" type="text" />
          </div>

          <div className="form-group">
            <label htmlFor="project">Tell us about your project *</label>
            <textarea className="form-control" name="project" ref="project" rows="4" />
          </div>

          <div className="form-group">
            <label htmlFor="referral">How did you hear about us&#63;</label>
            <input className="form-control" name="referal" ref="referal" type="text" />
          </div>

          <div className="form-group">
            <button className="btn btn-primary" type="submit">Send your project info</button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = ContactForm;
