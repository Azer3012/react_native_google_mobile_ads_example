import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';

// import MobileAds,{MaxAdContentRating }  from 'react-native-google-mobile-ads'

import Video from 'react-native-video';

import video from './assets/video.mp4'
import {
  AppOpenAd,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  BannerAdSize,
  AdEventType,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
  serverSideVerificationOptions: {
    userId: '',
    customData: 'my-custom-data',
  },
});

const App = () => {
  const [loaded, setLoaded] = useState(false);

  const [rewardedState, setRewardedState] = useState(false);

  const showInterstitialAd = () => {
    if (loaded) {
      interstitial.show();
    } else {
      interstitial.load();
    }
  };
  const showRewardedAd = () => {
    
    if (rewardedState) {
      rewarded.show();
      setRewardedState(false);
      rewarded.load()
    } else {
      rewarded.load();
    }
  };

  useEffect(() => {
    const eventListenerInterstitial = interstitial.onAdEvent(type => {
      if (type === AdEventType.LOADED) {
        setLoaded(true);
      }
      if (type === AdEventType.CLOSED) {
        console.log('ad closed');
        setLoaded(false);

        //reload ad
        interstitial.load();

        
      }
    });

    const eventListenerRewardedAd = rewarded.onAdEvent(
      (type, error, reward) => {
        if (type === RewardedAdEventType.LOADED) {
          setRewardedState(true);
        }
        if (type === RewardedAdEventType.EARNED_REWARD) {
          console.log('User earned reward of ', reward);
        }
        // if(type===RewardedAdEventType.CLOSED){
        //   setRewardedState(false)
        // }
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

  
    // Start loading the rewarded ad straight away
    rewarded.load()
   

    // Unsubscribe from events on unmount
    return () => {
      eventListenerInterstitial();
      eventListenerRewardedAd();
    };
  }, []);


  console.log({loaded,rewardedState});
  return (
    <View style={styles.app}>
      <BannerAd
        size={BannerAdSize.FULL_BANNER}
        unitId={TestIds.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Advert loaded');
        }}
        onAdFailedToLoad={error => {
          console.error('Advert failed to load: ', error);
        }}
      />

      <Text style={styles.title}>Google Ads</Text>

      <View style={styles.adsContainer}>
        <TouchableOpacity style={styles.ads} onPress={showInterstitialAd}>
          <Text style={styles.adsText}>Show Interstitial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ads} onPress={showRewardedAd}>
          <Text style={styles.adsText}>Show Rewarded</Text>
        </TouchableOpacity>
      </View>


      <Video 
      
      source={{uri:'https://www.youtube.com/watch?v=mpSmBuco6I0&t=1405s'}}
      paused={false}                     
      style={{width:350,height:400,borderWidth:1,alignSelf:'center',marginTop:40}}  
      repeat={true}
       
       />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  app:{
    flex:1
  },
  title:{
    marginVertical:20,
    textAlign:'center',
    fontWeight:'700'
  },
  adsContainer:{

  },
  ads:{
    width: 350,
    height: 40,
    borderWidth:1,
    borderColor:'ccc',
    marginHorizontal:20,
    marginBottom:10,
    justifyContent:'center',
    backgroundColor:'indigo'

  },
  adsText:{
    color: 'white',
    fontSize:18,
    fontWeight:'700',
    paddingLeft:20
  }
});
