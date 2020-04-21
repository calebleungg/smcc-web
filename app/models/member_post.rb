require 'date_format'

class MemberPost < ApplicationRecord
    belongs_to :user
    has_many :post_replies

    def poster
        return User.find(self.user_id)
    end
end
