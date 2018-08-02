import React, { Component } from "react";
import { graphql } from "react-apollo";
import {
    Form,
    FormGroup,
    Col,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle
} from "patternfly-react";

import { DataSourcesDropDown } from "./DataSourcesDropDown";
import { RequestMappingTemplateDropDown } from "./RequestMappingTemplateDropDown";
import { ResponseMappingTemplateDropDown } from "./ResponseMappingTemplateDropDown";
import { CodeEditor } from "../common/CodeEditor";

import UpsertResolver from "../../graphql/UpsertResolver.graphql";
import GetResolvers from "../../graphql/GetResolvers.graphql";

import styles from "./ResolverDetail.css";

const INITIAL_STATE = {
    resolver: null,
    dataSource: null,
    requestMapping: "Custom",
    responseMapping: "Custom",
    requestMappingTemplate: "",
    responseMappingTemplate: "",
    err: ""
};

class ResolverDetail extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.resolver !== nextProps.resolver) {
            this.setState({ resolver: nextProps.resolver });
        }
    }

    save() {
        const { id = undefined, type, field } = this.state.resolver;
        const { dataSource } = this.state; // ??
        const { requestMapping, responseMapping } = this.state;
        const schemaId = 1; // ??

        const variables = {
            id,
            schemaId,
            dataSourceId: dataSource.id,
            type,
            field,
            requestMapping,
            responseMapping
        };

        console.log("resolver: ", variables);
        this.props.mutate({
            variables
            // TODO:
            // refetchQueries: [{ query: GetResolvers }]
        })
            .then(() => {
                console.log("saved");
            })
            .catch(err => console.log(err));
    }

    cancel() {
        console.log("called cancel");
    }

    renderEmptyScreen() {
        return (
            <EmptyState className={styles.detailEmpty}>
                <EmptyStateIcon name="info" />
                <EmptyStateTitle className={styles.emptyTitle}>
                    Select an item to view and edit its details
                </EmptyStateTitle>
            </EmptyState>
        );
    }

    render() {
        const {
            resolver, dataSource, responseMapping, requestMapping, responseMappingTemplate,
            requestMappingTemplate
        } = this.state;

        if (!resolver) {
            return this.renderEmptyScreen();
        }

        return (
            <React.Fragment>
                <h3 className={styles.detailHeader}>Edit {resolver.type}.{resolver.field}</h3>
                <div className={styles.detailFormsContainer}>
                    <h3 className={styles.detailFormsHeader}>Resolver
                        <span className={styles.learnMore}>
                            <a href="https://www.google.es">Learn More <span className="fa fa-external-link" /></a>
                        </span>
                    </h3>

                    <Form horizontal className={styles.formContainer}>
                        <FormGroup controlId="dataSource" className={styles.detailFormGroup}>
                            <DataSourcesDropDown
                                selected={dataSource}
                                onDataSourceSelect={ds => this.setState({ dataSource: ds })}
                            />
                        </FormGroup>

                        <FormGroup controlId="responseMapping" className={styles.detailFormGroup}>
                            <ResponseMappingTemplateDropDown
                                value={responseMapping}
                                onSelect={item => this.setState({ responseMapping: item })}
                            />
                            <Col sm={12}>
                                <div className={styles.detailCodeEditor}>
                                    <CodeEditor
                                        value={responseMappingTemplate}
                                        onChange={
                                            t => this.setState({ responseMappingTemplate: t })
                                        }
                                    />
                                </div>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="requestMapping" className={styles.detailFormGroup}>
                            <RequestMappingTemplateDropDown
                                value={requestMapping}
                                onSelect={item => this.setState({ requestMapping: item })}
                            />
                            <Col sm={12}>
                                <div className={styles.detailCodeEditor}>
                                    <CodeEditor
                                        value={requestMappingTemplate}
                                        onChange={t => this.setState({ requestMappingTemplate: t })}
                                    />
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>

                <div className={styles.detailButtonFooter}>
                    <Button
                        className={styles.buttonSave}
                        bsStyle="primary"
                        onClick={() => this.save()}
                    >
                        Save
                    </Button>
                    <Button
                        bsStyle="default"
                        onClick={() => this.cancel()}
                    >
                        Cancel
                    </Button>
                </div>

            </React.Fragment>
        );
    }

}

const ResolverDetailWithMutation = graphql(UpsertResolver)(ResolverDetail);

export { ResolverDetailWithMutation as ResolverDetail };
