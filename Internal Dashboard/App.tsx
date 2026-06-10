import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { isSupabaseConfigured } from './src/config/env';
import { DataProvider } from './src/context/DataProvider';
import { DashboardScreen } from './src/screens/DashboardScreen';

function AppContent() {
  return (
    <View style={styles.root}>
      <DashboardScreen />
    </View>
  );
}

export default function App() {
  if (!isSupabaseConfigured()) {
    return (
      <View style={styles.root}>
        <DashboardScreen />
      </View>
    );
  }

  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

const viewportHeight = Platform.select({
  web: '100vh',
  default: '100%',
}) as ViewStyle['height'];

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: viewportHeight,
    overflow: 'hidden',
  },
});
