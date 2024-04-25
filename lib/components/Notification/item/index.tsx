import React, { useState } from "react";
import clsx from "clsx";
import { STATUS, TYPE } from "../../../utils/notification-utils";
import { Notification } from "../base";
import type { NotificationProps } from "../base";

export interface NotificationItemProps
    extends Omit<NotificationProps, "isBanner" | "hasCloseButton"> {
    className?: string;
    type?: (typeof TYPE)[keyof typeof TYPE];
    isMobile?: boolean;
}

const DIRECTION = {
    LEFT: "left",
    RIGHT: "right",
};

const NotificationItem = ({
    className,
    status,
    type = "info",
    isMobile,
    onClose,
    onMarkAsRead,
    ...rest
}: NotificationItemProps) => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [shouldShowButtons, setShouldShowButtons] = useState(false);

    const handleClose = () => {
        setIsDeleted(true);
        onClose?.();
    };

    const handleMarkAsRead = (e?: React.MouseEvent<HTMLButtonElement>) => {
        setShouldShowButtons(false);
        onMarkAsRead?.(e);
    };

    const handleSwipe = (direction: string) => {
        setShouldShowButtons(direction === DIRECTION.LEFT);
    };

    return (
        <div
            className={clsx(
                "notification__item-wrapper",
                isDeleted && "deleted",
            )}
        >
            <Notification
                {...rest}
                className={clsx(
                    `notification__item${isMobile ? "--mobile" : ""}`,
                    shouldShowButtons &&
                        `show-buttons${status === STATUS.READ ? "--read" : ""}`,
                    className,
                )}
                onClose={handleClose}
                onMarkAsRead={handleMarkAsRead}
                onSwipeLeft={
                    isMobile ? () => handleSwipe(DIRECTION.LEFT) : undefined
                }
                onSwipeRight={
                    isMobile ? () => handleSwipe(DIRECTION.RIGHT) : undefined
                }
                status={status}
                type={type}
            />
        </div>
    );
};

export default NotificationItem;
