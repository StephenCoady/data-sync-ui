import React from "react";
import {
    ListView,
    DropdownKebab,
    MenuItem
} from "patternfly-react";

const DataSourcesListItem = ({ item, onEditDataSource, onDeleteDataSource }) => {
    const { type, name } = item;

    return (
        <ListView.Item
            className="ds-list-item"
            heading={type}
            leftContent={(
                <span className="list-item-name">{name}</span>
            )}
            actions={(
                <div>
                    <DropdownKebab id="data-source-list-item-dropdown" pullRight>
                        <MenuItem onSelect={() => onEditDataSource(item)}>
                            Edit Data Source
                        </MenuItem>
                        <MenuItem onSelect={() => onDeleteDataSource(item)}>
                            Delete Data Source
                        </MenuItem>
                    </DropdownKebab>
                </div>
            )}
        />
    );
};

export { DataSourcesListItem };
