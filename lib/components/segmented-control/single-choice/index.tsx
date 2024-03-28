import React, { useEffect } from "react";
import clsx from "clsx";
import { SegmentedControl } from "../base";
import type { SegmentedControlProps } from "../base";

export interface SegmentedControlSingleChoiceProps
    extends SegmentedControlProps {
    hasContainerWidth?: boolean;
    options: Array<{
        icon?: string | React.ReactNode;
        label?: string;
        disabled?: boolean;
    }>;
    selectedItemIndex?: number;
}

const SegmentedControlSingleChoice = ({
    className,
    options = [],
    onChange,
    hasContainerWidth,
    selectedItemIndex = 0,
    size = "md",
}: SegmentedControlSingleChoiceProps) => {
    const [items, setItems] =
        React.useState<SegmentedControlProps["options"]>(options);

    const updateItems = (
        new_options: SegmentedControlProps["options"],
        idx: number,
    ) => {
        if (idx >= new_options.length) return;
        setItems([
            ...new_options.map((item, i) => ({
                ...item,
                selected: !item.disabled && i === idx,
            })),
        ]);
    };

    const handleItemClick = (idx: number) => {
        updateItems(items, idx);
        onChange?.(idx);
    };

    useEffect(() => {
        const selected = items.findIndex((i) => i.selected);
        if (selectedItemIndex !== selected) {
            updateItems(items, selectedItemIndex);
        } else {
            updateItems(options, selected !== -1 ? selected : 0);
        }
    }, [options, selectedItemIndex]);

    if (!options.length) return null;
    return (
        <SegmentedControl
            className={clsx(
                "segmented-control-single",
                `segmented-control-single--${size}`,
                hasContainerWidth &&
                    "segmented-control-single--has-container-width",
                className,
            )}
            options={items}
            onChange={handleItemClick}
            size={size}
        />
    );
};

export default SegmentedControlSingleChoice;
