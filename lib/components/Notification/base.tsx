import React from "react";
import {
    LabelPairedCheckSmBoldIcon,
    LabelPairedTrashSmBoldIcon,
    LabelPairedXmarkSmRegularIcon,
} from "@deriv/quill-icons";
import clsx from "clsx";
import { useSwipeable } from "react-swipeable";
import { CaptionText, Text } from "../Typography";
import { NotificationIcon } from "./notification-icon";
import { STATUS, TYPE } from "../../utils/notification-utils";
import "./notification.scss";

export interface NotificationProps
    extends Omit<React.HTMLProps<HTMLDivElement>, "title"> {
    className?: string;
    hasCloseButton?: boolean;
    href?: string;
    icon?: React.ReactNode;
    iconBackgroundColor?: string;
    isBanner?: boolean;
    message?: React.ReactNode;
    onClose?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    onMarkAsRead?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    onSwipeDown?: () => void;
    onSwipeUp?: () => void;
    status?: (typeof STATUS)[keyof typeof STATUS];
    timestamp?: number;
    title?: React.ReactNode;
    type?: (typeof TYPE)[keyof typeof TYPE];
}

export const Notification = ({
    className,
    hasCloseButton,
    href,
    icon,
    iconBackgroundColor,
    isBanner,
    message,
    onClose,
    onMarkAsRead,
    onSwipeDown,
    onSwipeUp,
    status = STATUS.UNREAD,
    timestamp,
    title,
    type,
    ...rest
}: NotificationProps) => {
    const formattedTime = `${new Date(timestamp ?? 0).getDate()} ${new Date(
        timestamp ?? 0,
    ).toLocaleString("en", {
        month: "short",
        year: "numeric",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
    })}`.replace(",", "");

    const swipeHandlers = useSwipeable({
        onSwipedUp: onSwipeUp,
        onSwipedDown: onSwipeDown,
        trackMouse: true,
    });

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onClose?.(e);
    };

    return (
        <div
            {...rest}
            {...swipeHandlers}
            className={clsx("notification", className)}
        >
            <a
                className="body"
                href={href}
                onDragStart={(e) => e.preventDefault()}
            >
                <div
                    className={clsx("icon", type)}
                    style={{ backgroundColor: iconBackgroundColor }}
                >
                    {icon ?? <NotificationIcon type={type} />}
                    {!isBanner && status === STATUS.UNREAD && (
                        <div className="badge-unread" />
                    )}
                </div>
                <div className="details">
                    <Text
                        className="title"
                        bold={status === STATUS.UNREAD}
                        size="sm"
                    >
                        {title}
                    </Text>
                    {isBanner ? (
                        <CaptionText className="message" bold={false}>
                            {message}
                        </CaptionText>
                    ) : (
                        <Text className="message" size="sm">
                            {message}
                        </Text>
                    )}
                    {!isBanner && timestamp && (
                        <CaptionText className="date-time">
                            {formattedTime}
                        </CaptionText>
                    )}
                </div>
            </a>
            {isBanner && hasCloseButton && (
                <button className={clsx("icon", "close")} onClick={handleClose}>
                    <LabelPairedXmarkSmRegularIcon />
                </button>
            )}
            {!isBanner && (
                <div className="buttons">
                    {status === STATUS.UNREAD ? (
                        <div className="mark-as-read">
                            <button
                                className="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsRead?.(e);
                                }}
                            >
                                <LabelPairedCheckSmBoldIcon />
                            </button>
                        </div>
                    ) : (
                        href && (
                            <a href={href} className={clsx("icon", "nav")} />
                        )
                    )}
                    <div className="delete">
                        <button className="icon" onClick={handleClose}>
                            <LabelPairedTrashSmBoldIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
