import { useVideoPlayer, VideoView, type VideoPlayer } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

const BRAND_VIDEO = require('@/assets/onboarding/brand-bg.mov');

type BrandStoryBackgroundProps = {
  visible: boolean;
};

function safePause(player: VideoPlayer) {
  try {
    player.pause();
  } catch {
    // Player may already be released when onboarding unmounts.
  }
}

export function BrandStoryBackground({ visible }: BrandStoryBackgroundProps) {
  const player = useVideoPlayer(BRAND_VIDEO, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (visible) {
      player.play();
    } else {
      safePause(player);
    }
  }, [visible, player]);

  return (
    <View
      style={[styles.container, !visible && styles.hidden]}
      pointerEvents="none"
      accessibilityElementsHidden={!visible}
    >
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
      <View style={styles.dim} />
      <LinearGradient
        style={styles.bottomGradient}
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.55)', 'rgba(0, 0, 0, 0.85)']}
        locations={[0, 0.55, 1]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    backgroundColor: '#000',
  },
  hidden: {
    opacity: 0,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '48%',
  },
});
