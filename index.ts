import type { TransformsStyle, Animated } from "react-native";

/*
* Taken from the PR by elliottkember: https://github.com/sueLan/react-native-anchor-point/pull/16
*/

export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

const isValidSize = (size: Size): boolean => {
    return size && size.width > 0 && size.height > 0;
};

const defaultAnchorPoint = { x: 0.5, y: 0.5 };

export const withAnchorPoint = (
    transform: TransformsStyle | Animated.WithAnimatedValue<TransformsStyle>,
    anchorPoint: Point, size: Size
) => {
    if (!isValidSize(size)) {
        return transform;
    }

    let injectedTransform = transform.transform;
    if (!injectedTransform) {
        return transform;
    }

    if (anchorPoint.x !== defaultAnchorPoint.x && size.width) {
        const shiftTranslateX: { translateX: number }[] = [];

        // shift before rotation
        shiftTranslateX.push({
            translateX: size.width * (anchorPoint.x - defaultAnchorPoint.x),
        });

        if (Array.isArray(injectedTransform)) {
            injectedTransform = [...shiftTranslateX, ...injectedTransform];
            // shift after rotation
            injectedTransform.push({
                translateX: size.width * (defaultAnchorPoint.x - anchorPoint.x),
            });
        }
    }

    if (!Array.isArray(injectedTransform)) {
        return { transform: injectedTransform };
    }

    if (anchorPoint.y !== defaultAnchorPoint.y && size.height) {
        let shiftTranslateY: { translateY: number }[] = [];
        // shift before rotation
        shiftTranslateY.push({
            translateY: size.height * (anchorPoint.y - defaultAnchorPoint.y),
        });
        injectedTransform = [...shiftTranslateY, ...injectedTransform];
        // shift after rotation
        injectedTransform.push({
            translateY: size.height * (defaultAnchorPoint.y - anchorPoint.y),
        });
    }

    return { transform: injectedTransform };
};