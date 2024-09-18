import { Component, createRef } from "react";
class ErrorBoundary extends Component<any, any> {
  container = createRef<HTMLDivElement>();
  constructor(props: any) {
    super(props);
    this.state = {
      hasBeError: false,
      errMsg: "",
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      hasBeError: true,
      errMsg: String(error),
    });
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  componentDidUpdate(): void {
    if (this.state.hasBeError == false)
      this.props.onUpdate?.(this.container.current?.clientHeight || 0);
  }

  render() {
    return (
      <div className="error-boundary-container" ref={this.container}>
        {this.state.hasBeError ? (
          <div className="err-msg">{this.state.errMsg}</div>
        ) : (
          this.props.children
        )}
      </div>
    );
  }
}

export default ErrorBoundary;
