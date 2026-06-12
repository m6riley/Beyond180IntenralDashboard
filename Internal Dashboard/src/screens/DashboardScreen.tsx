import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

const coach180Logo = require('../../assets/coach180-logo.png');

import { DashboardSection } from '../components/DashboardSection';
import { GamesSectionContent } from '../components/GamesSectionContent';
import { SquadsSectionContent } from '../components/SquadsSectionContent';
import { SupabaseAccessBanner } from '../components/SupabaseAccessBanner';
import { UsersSectionContent } from '../components/UsersSectionContent';

export function DashboardScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a1f44', '#1e4a8a', '#93c5fd']}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
        style={styles.titleBar}
      >
        <View style={styles.titleRow}>
          <Image
            accessibilityLabel="Coach180 logo"
            source={coach180Logo}
            style={styles.logo}
          />
          <Text style={styles.title}>Coach180 App Statistics</Text>
        </View>
      </LinearGradient>
      <SupabaseAccessBanner />
      <View style={styles.content}>
        <View style={styles.sections}>
          <View style={styles.column}>
            <DashboardSection title="Squads">
              <SquadsSectionContent />
            </DashboardSection>
          </View>
          <View style={styles.column}>
            <DashboardSection title="Users" fill={false} style={styles.usersSection}>
              <UsersSectionContent />
            </DashboardSection>
            <View style={styles.gamesArea}>
              <DashboardSection title="Games">
                <GamesSectionContent />
              </DashboardSection>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const viewportHeight = Platform.select({
  web: '100vh',
  default: '100%',
}) as ViewStyle['height'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    width: '100%',
    height: viewportHeight,
    overflow: 'hidden',
  },
  titleBar: {
    minHeight: 72,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sections: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 0,
    minWidth: 0,
    overflow: 'hidden',
    alignItems: 'stretch',
  },
  column: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    flexDirection: 'column',
    gap: 8,
    overflow: 'hidden',
  },
  usersSection: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
  },
  gamesArea: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  },
});
