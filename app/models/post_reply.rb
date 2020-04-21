class PostReply < ApplicationRecord
  belongs_to :user
  belongs_to :member_post

  def replier
    return User.find(self.user_id)
  end

end
