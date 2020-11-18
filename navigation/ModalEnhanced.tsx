import React, { Component, useRef } from "react";
import { Text, TouchableOpacity, View, ScrollView, TextInput, TouchableHighlight, Button } from "react-native";
import Modal from "modal-enhanced-react-native-web";
import styles from "./styles";

export default class ModalEnhanced extends Component {
    state = {
        visibleModal: null,
        handleSubmit: (value) => { },
        value: '',
        scrollOffset: null,
        setModalVisible: (value) => { },
    };
    scrollViewRef;

    constructor(props) {
        super(props);
        this.state = {
            visibleModal: props.modalNumber,
            handleSubmit: props.handleSubmit,
            value: props.headerTitle,
            scrollOffset: 2,
            setModalVisible: props.setModalVisible,
        }
    }

    _renderButton = (text, onPress) => (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>
    );

    _renderModalContent = () => (
        <View style={styles.modalContent}>
            <Text>Hello!</Text>
            {this._renderButton("Close", () => this.setState({ visibleModal: null }))}
        </View>
    );

    _renderHeaderEditContent = () => {
        return (
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>Update your Todo List name!!</Text>
                    <TextInput
                        placeholder="Update your To-do List name here!"
                        value={this.state.value}
                        onChangeText={e => {
                            this.setState({ value: e })
                        }}
                        autoCapitalize="words"
                        style={styles.modalText}
                        onSubmitEditing={() => {
                            this.state.handleSubmit(this.state.value)
                            this.setState({ visibleModal: null })
                        }}
                    />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: 150 }}>
                        <Button
                            color="#2196F3"
                            onPress={() => {
                                this.state.handleSubmit(this.state.value)
                                this.setState({ visibleModal: null })
                            }}
                            title="Update"
                        >
                        </Button>
                        <Button
                            onPress={() => {
                                this.setState({ visibleModal: null })
                            }}
                            color="red"
                            title="Cancel"
                        >
                        </Button>
                    </View>
                </View>
            </View>
        )
    }

    _handleOnScroll = event => {
        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y
        });
    };

    _handleScrollTo = p => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo(p);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Modal isVisible={this.state.visibleModal === 1}>
                    {this._renderModalContent()}
                </Modal>
                <Modal
                    isVisible={this.state.visibleModal === 2}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight"
                >
                    {this._renderModalContent()}
                </Modal>
                <Modal
                    isVisible={this.state.visibleModal === 3}
                    animationInTiming={2000}
                    animationOutTiming={2000}
                    backdropTransitionInTiming={2000}
                    backdropTransitionOutTiming={2000}
                >
                    {this._renderModalContent()}
                </Modal>
                <Modal
                    isVisible={this.state.visibleModal === 4}
                    // backdropColor="transparent"
                    // backdropOpacity={1}
                    onBackdropPress={() => {
                        this.setState({ visibleModal: null });
                    }}
                    animationIn="slideInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    onDismiss={() => {
                        this.state.setModalVisible(false)
                    }}
                >
                    {this._renderHeaderEditContent()}
                </Modal>
                <Modal
                    isVisible={this.state.visibleModal === 5}
                    style={styles.bottomModal}
                >
                    {this._renderModalContent()}
                </Modal>
                <Modal
                    isVisible={this.state.visibleModal === 6}
                    onBackdropPress={() => this.setState({ visibleModal: null })}
                >
                    {this._renderModalContent()}
                </Modal>
                <Modal
                    isVisible={this.state.visibleModal === 7}
                    onSwipe={() => this.setState({ visibleModal: null })}
                    swipeDirection="left"
                >
                    {this._renderModalContent()}
                </Modal>
                <Modal
                    isVisible={this.state.visibleModal === 8}
                    onSwipe={() => this.setState({ visibleModal: null })}
                    swipeDirection="down"
                    scrollTo={this._handleScrollTo}
                    scrollOffset={this.state.scrollOffset}
                    scrollOffsetMax={400 - 300} // content height - ScrollView height
                    style={styles.bottomModal}
                >
                    <View style={styles.scrollableModal}>
                        <ScrollView
                            ref={ref => (this.scrollViewRef = ref)}
                            onScroll={this._handleOnScroll}
                            scrollEventThrottle={16}
                        >
                            <View style={styles.scrollableModalContent1}>
                                <Text>Scroll me up</Text>
                            </View>
                            <View style={styles.scrollableModalContent1}>
                                <Text>Scroll me up</Text>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        );
    }
}
