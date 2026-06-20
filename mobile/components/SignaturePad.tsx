import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../constants/theme';

interface Props {
  onChange: (signatureData: string, isEmpty: boolean) => void;
}

export function SignaturePad({ onChange }: Props) {
  const [paths, setPaths] = useState<string[]>([]);
  const currentPath = useRef('');
  const [, forceUpdate] = useState(0);
  const size = useRef({ width: 300, height: 160 });

  const notifyChange = useCallback(
    (nextPaths: string[]) => {
      const data = JSON.stringify(nextPaths);
      onChange(data, nextPaths.length === 0);
    },
    [onChange]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX: x, locationY: y } = evt.nativeEvent;
        currentPath.current = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        setPaths((prev) => {
          const next = [...prev, currentPath.current];
          notifyChange(next);
          return next;
        });
      },
      onPanResponderMove: (evt) => {
        const { locationX: x, locationY: y } = evt.nativeEvent;
        currentPath.current += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        setPaths((prev) => {
          const next = [...prev.slice(0, -1), currentPath.current];
          notifyChange(next);
          return next;
        });
        forceUpdate((n) => n + 1);
      },
    })
  ).current;

  const clear = () => {
    currentPath.current = '';
    setPaths([]);
    notifyChange([]);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    size.current = {
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    };
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>請在下方簽名確認</Text>
      <View style={styles.pad} onLayout={onLayout} {...panResponder.panHandlers}>
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${size.current.width} ${size.current.height}`}
        >
          {paths.map((d, i) => (
            <Path
              key={i}
              d={d}
              stroke={theme.colors.navy}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
        {paths.length === 0 && (
          <Text style={styles.placeholder}>請用手指在此簽名</Text>
        )}
      </View>
      <TouchableOpacity onPress={clear} style={styles.clearBtn}>
        <Text style={styles.clearText}>清除簽名</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: theme.spacing.sm },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.navy,
    marginBottom: 8,
  },
  pad: {
    height: 160,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.lavender,
    borderStyle: 'dashed',
    overflow: 'hidden',
    position: 'relative',
  },
  placeholder: {
    position: 'absolute',
    alignSelf: 'center',
    top: '42%',
    color: theme.colors.gray,
    fontSize: theme.fontSize.sm,
    pointerEvents: 'none',
  },
  clearBtn: { alignSelf: 'flex-end', marginTop: 8, padding: 4 },
  clearText: {
    color: theme.colors.pinkDeep,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
});
