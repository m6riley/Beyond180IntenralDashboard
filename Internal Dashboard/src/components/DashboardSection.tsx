import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

type DashboardSectionProps = {
  title: string;
  children?: ReactNode;
  fill?: boolean;
  style?: ViewStyle;
};

export function DashboardSection({
  title,
  children,
  fill = true,
  style,
}: DashboardSectionProps) {
  return (
    <View style={[styles.section, !fill && styles.sectionCompact, style]}>
      <Text style={[styles.sectionTitle, !fill && styles.sectionTitleCompact]}>
        {title}
      </Text>
      <View
        style={[styles.sectionContent, !fill && styles.sectionContentCompact]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  sectionTitleCompact: {
    paddingVertical: 8,
  },
  sectionContent: {
    flex: 1,
    minHeight: 0,
    padding: 8,
    gap: 8,
  },
  sectionCompact: {
    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
  },
  sectionContentCompact: {
    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
    minHeight: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
