import React, { ReactNode, useEffect, HTMLAttributes, useRef } from "react";
import { Text } from "@components/Typography";
import clsx from "clsx";
import { Button } from "@components/Button";
import { LabelPairedXmarkSmBoldIcon } from "@deriv/quill-icons";
import { useSnackbar } from "@hooks/useSnackbar";
import { useOnClickOutside } from "usehooks-ts";
import { TDefaultColor } from "@types";
import "./snackbar.scss";

export interface SnackbarProps extends HTMLAttributes<HTMLDivElement> {
    icon?: ReactNode;
    id?: string;
    isVisible?: boolean;
    message: ReactNode;
    actionText?: string;
    hasCloseButton?: boolean;
    onActionClick?: () => void;
    onCloseAction?: () => void;
    delay?: number;
    standalone?: boolean;
    status?: "fail" | "neutral";
}

export const Snackbar = ({
    icon: Icon,
    id,
    isVisible,
    message,
    actionText,
    onActionClick,
    onCloseAction,
    hasCloseButton = true,
    delay,
    standalone = true,
    status = "neutral",
    ...rest
}: SnackbarProps) => {
    const { removeSnackbar } = useSnackbar();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const snackbarDelayedRemove = (id: string, delay: number = 4000) => {
        return setTimeout(() => {
            removeSnackbar(id);
        }, delay);
    };

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        id && (timerRef.current = snackbarDelayedRemove(id));

        return () => {
            clearTimeout(timerRef.current ?? "");
        };
    }, [message]);

    const handleClose = (delay: number = 100) => {
        onCloseAction?.();
        if (timerRef) clearTimeout(timerRef.current ?? "");
        id && snackbarDelayedRemove(id, delay);
    };

    const handleActionClick = () => {
        onActionClick?.();
        handleClose();
    };

    id && useOnClickOutside(ref, () => removeSnackbar(id));

    if (standalone && !isVisible) return null;

    const color = {
        neutral: "white-black",
        fail: "white"
    }

    const buttonColor = color[status] as TDefaultColor;
    
    return (
        <div
            {...rest}
            className={clsx(
                "quill-snackbar",
                `quill-snackbar__status--${status}`,
                isVisible ? "slide-up" : "slide-up slide-down",
            )}
            ref={ref}
        >
            {Icon && (
                <div className={clsx("quill-snackbar__icon--container")}>
                    {React.isValidElement(Icon) &&
                        React.cloneElement(Icon, {
                            fill: `var(--component-snackbar-icon-${status})`,
                            ...Icon.props,
                        })}
                </div>
            )}
            <div className="quill-snackbar__message--container">
                <Text
                    className="quill-snackbar__message"
                    size="sm"
                    style={{
                        color: `var(--component-snackbar-label-color-${status})`,
                    }}
                >
                    {message}
                </Text>
            </div>
            {actionText && (
                <Button
                    variant="tertiary"
                    label={actionText}
                    color={buttonColor}
                    onClick={handleActionClick}
                />
            )}
            {hasCloseButton && (
                <Button
                    variant="tertiary"
                    iconPosition="start"
                    icon={<LabelPairedXmarkSmBoldIcon />}
                    color={buttonColor}
                    size="md"
                    onClick={() => handleClose(delay)}
                    data-testid="close-button"
                />
            )}
        </div>
    );
};
