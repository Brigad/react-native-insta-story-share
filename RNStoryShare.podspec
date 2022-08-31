
Pod::Spec.new do |s|
  s.name         = "RNStoryShare"
  s.version      = "1.0.2"
  s.summary      = "RNStoryShare"
  s.description  = "Share your images to instagram stories."
  s.homepage     = "https://github.com/Jobeso/react-native-story-share"
  s.license      = "MIT"
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNStoryShare.git", :tag => "master" }
  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true


  s.dependency "React"

end
