/********* BaiduSpeechAndTTS.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import <AVFoundation/AVFoundation.h>
#import "BDSSpeechSynthesizerDelegate.h"
#import "BDSSpeechSynthesizer.h"
#import "BDS_EttsModelManagerInterface.h"
#import "BDSTTSEventManager.h"

@interface XjBaiduTts : CDVPlugin<BDSSpeechSynthesizerDelegate> {
  // Member variables go here.@property (nonatomic, strong) NSString* callbackId;
  @property (nonatomic, strong) NSString* callbackId;
}

- (void)speak:(CDVInvokedUrlCommand*)command;
@end


#define READ_SYNTHESIS_TEXT_FROM_FILE (NO)
static BOOL isSpeak = YES;
static BOOL textFromFile = READ_SYNTHESIS_TEXT_FROM_FILE;
static BOOL displayAllSentences = !READ_SYNTHESIS_TEXT_FROM_FILE;

#error 请在官网新建app，配置bundleId，并在此填写相关参数
NSString* APP_ID = @"14502702";
NSString* API_KEY = @"6YvlNRGZ5I4CkA715XnVyoSm";
NSString* SECRET_KEY = @"9oHZPMLgc0BM9a4m3DhpHUhGSqYvsrAF";

@implementation XjBaiduTts

#pragma mark Initialization functions

- (void) pluginInitialize {
    [self configureSDK];
}

-(void)configureSDK{
    NSLog(@"TTS version info: %@", [BDSSpeechSynthesizer version]);
    [BDSSpeechSynthesizer setLogLevel:BDS_PUBLIC_LOG_VERBOSE];
    [self configureOnlineTTS];
    [self configureOfflineTTS];

}

-(void)configureOnlineTTS{

    [[BDSSpeechSynthesizer sharedInstance] setApiKey:API_KEY withSecretKey:SECRET_KEY];

    [[AVAudioSession sharedInstance]setCategory:AVAudioSessionCategoryPlayback error:nil];
    //    [[BDSSpeechSynthesizer sharedInstance] setSynthParam:@(BDS_SYNTHESIZER_SPEAKER_DYY) forKey:BDS_SYNTHESIZER_PARAM_SPEAKER];
    //    [[BDSSpeechSynthesizer sharedInstance] setSynthParam:@(10) forKey:BDS_SYNTHESIZER_PARAM_ONLINE_REQUEST_TIMEOUT];

}

-(void)configureOfflineTTS{

    NSError *err = nil;
    // 在这里选择不同的离线音库（请在XCode中Add相应的资源文件），同一时间只能load一个离线音库。根据网络状况和配置，SDK可能会自动切换到离线合成。
    NSString* offlineEngineSpeechData = [[NSBundle mainBundle] pathForResource:@"Chinese_And_English_Speech_Female" ofType:@"dat"];

    NSString* offlineChineseAndEnglishTextData = [[NSBundle mainBundle] pathForResource:@"Chinese_And_English_Text" ofType:@"dat"];

    err = [[BDSSpeechSynthesizer sharedInstance] loadOfflineEngine:offlineChineseAndEnglishTextData speechDataPath:offlineEngineSpeechData licenseFilePath:nil withAppCode:APP_ID];
    if(err){
        [self displayError:err withTitle:@"Offline TTS init failed"];
        return;
    }
    [TTSConfigViewController loadedAudioModelWithName:@"Chinese female" forLanguage:@"chn"];
    [TTSConfigViewController loadedAudioModelWithName:@"English female" forLanguage:@"eng"];
}



- (void)speak:(CDVInvokedUrlCommand*)command
{

    NSString* text = [command.arguments objectAtIndex:0];
    NSInteger sentenceID;
    NSError* err = nil;
    [[BDSSpeechSynthesizer sharedInstance] setSynthesizerDelegate:self];
    self.callbackId = command.callbackId;
    sentenceID = [[BDSSpeechSynthesizer sharedInstance] speakSentence:[string text] withError:&err];
    if(err != nil){
       NSLog(@"Did finish synth, %ld", err);
    }
}

#pragma mark - implement BDSSpeechSynthesizerDelegate
- (void)synthesizerStartWorkingSentence:(NSInteger)SynthesizeSentence{
    NSLog(@"Did synthesizerStartWorkingSentence synth %ld", SynthesizeSentence);
}

- (void)synthesizerFinishWorkingSentence:(NSInteger)SynthesizeSentence{
    NSLog(@"Did synthesizerFinishWorkingSentence synth, %ld", SynthesizeSentence);
}

- (void)synthesizerSpeechStartSentence:(NSInteger)SpeakSentence{
    NSLog(@"Did synthesizerSpeechStartSentence speak %ld", SpeakSentence);
}

- (void)synthesizerSpeechEndSentence:(NSInteger)SpeakSentence{
    NSLog(@"Did synthesizerSpeechEndSentence speak %ld", SpeakSentence);
   if (self.callbackId) {
       NSDictionary* info = [NSDictionary dictionaryWithObjectsAndKeys:@"SpeechResults",STR_EVENT,SpeakSentence,STR_RESULTS, nil];
       CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:info];
       [result setKeepCallbackAsBool:YES];
       [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
   }
}

- (void)synthesizerNewDataArrived:(NSData *)newData
                       DataFormat:(BDSAudioFormat)fmt
                   characterCount:(int)newLength
                   sentenceNumber:(NSInteger)SynthesizeSentence{
    NSLog(@"Did synthesizerNewDataArrived speak %ld", SynthesizeSentence);
}

- (void)synthesizerTextSpeakLengthChanged:(int)newLength
                           sentenceNumber:(NSInteger)SpeakSentence{

    NSLog(@"Did synthesizerTextSpeakLengthChanged speak %ld", SpeakSentence);
}

- (void)synthesizerdidPause{
    NSLog(@"Did synthesizerdidPause speak");
}

- (void)synthesizerResumed{
    NSLog(@"Did synthesizerResumed");
}

- (void)synthesizerCanceled{
    NSLog(@"Did synthesizerCanceled");
}

- (void)synthesizerErrorOccurred:(NSError *)error
                        speaking:(NSInteger)SpeakSentence
                    synthesizing:(NSInteger)SynthesizeSentence{
    NSLog(@"Did synthesizerErrorOccurred %ld, %ld", SpeakSentence, SynthesizeSentence);
}


@end