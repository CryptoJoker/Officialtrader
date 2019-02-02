// http://207.246.78.168/?id=10&aId=1&currency=EUR&name=PandaFX&logo=http://lp.kayafx.net/wp-content/uploads/2015/01/logo-large.png
// http://localhost:4200/?id=10&aId=1&currency=EUR&name=PandaFX&logo=http:%2F%2Fwww.google.com

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { codes } from 'iso-country-codes';
import phoneNumber from 'awesome-phonenumber';
import toml from 'toml-j0.4';
import * as countriesList from 'countries-list';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BrokerService } from '../broker.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import * as cities from 'countries-cities';
import * as moment from 'moment';
import * as crypto from 'cryptocurrencies';

@Component({
  selector: 'app-page-landing',
  templateUrl: './page-landing.component.v2.html',
  styleUrls: ['./page-landing.component.v2.scss']
})
export class PageLandingComponent implements OnInit {
  regexPassword = /^[a-zA-Z0-9]*$/;
  str: any = {};
  langData: any = undefined;
  pageNumber: number = 0;
  faqs: any = [];
  testimonialsOrder: any = _.shuffle([0, 1, 2, 3]);
  people: any = [];
  earnings: any = [];
  person: any = {
    name: 'Alice C.',
    photo: './assets/img/girl.jpg',
    amount: '350'
  };
  countries: any = [];
  currentCountry: any = {};
  countrySearchText: any = '';
  selfInfo: any = {
    currency: '$'
  };
  modal: any = {
    isLoading: false,
    show: false,
    success: false
  };
  formData: any = {
    showDialog: false,
    isLoading: false
  };
  broker: any = {
    name: null,
    logo: null,
    message: null,
    refer: null,
    id: null,
    affiliateId: null,
    campaignKeyword: null,
    comment: null,
    clickId: null
  };
  allPeople: any = [];
  todayDate: any;
  countdownDate: any;
  countdownTimer: any;
  trades = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private localStorage: LocalStorage,
    private brokerService: BrokerService
  ) {
    

    this.route.queryParams.subscribe(qs => {
      this.autologin();
      this.countdownDate = moment().add(1, 'days');
      this.todayDate = moment()
        .add(1, 'days')
        .format('L');

      // this.broker.name = qs.name;
      // this.broker.logoId = qs.logo;
      // this.broker.id = qs.id;
      // this.broker.refer = qs.refer;
      this.broker.campaignKeyword = qs.campaignkeyword;
      // this.broker.comment = qs.comment;
      this.broker.affiliateId = qs.aid;
      this.broker.clickId = qs.clickid;
      this.broker.pixelID = qs.pixel;
      this.broker.iframeURL = '';

      if (this.broker.pixelID) {
        this.http
          .get(`assets/pixel.json`, { responseType: 'text' })
          .subscribe((data: string) => {
            const pixels = JSON.parse(data);
            
            const match = _.find(pixels.pixels, {
              id: +this.broker.pixelID
            }) as any;
            
            this.broker.iframeURL = match.url;
            console.log(this.broker.iframeURL);
          });
      }

      const eventTime = this.countdownDate.unix();
      const doCountdown = () => {
        const currentTime = moment().unix();
        // tslint:disable-next-line:prefer-const
        let diffTime = eventTime - currentTime;
        let duration = moment.duration(diffTime * 1000, 'milliseconds');
        duration = moment.duration(
          (duration as any) - (1000 as any),
          'milliseconds'
        );
        this.countdownTimer =
          duration.hours() +
          ':' +
          duration.minutes() +
          ':' +
          duration.seconds();
      };
      doCountdown();

      setInterval(() => {
        doCountdown();
      }, 1000);

      this.countries = codes.map((x: any) => {
        return {
          name: x.name,
          code: x.alpha2,
          countryCode: phoneNumber.getCountryCodeForRegionCode(x.alpha2),
          class: `flag-icon flag-icon-${x.alpha2.toLowerCase()}`
        };
      });

      // localization issue
      this.selfInfo.lang = 'en';
      this.http
        .get(`assets/lang/${this.selfInfo.lang}/strings.ini`, {
          responseType: 'text'
        })
        .subscribe(
          (data: string) => {
            this.loadData(data);
            // let ip = '/';
            // tslint:disable-next-line:no-shadowed-variable
            this.http.get(`https://ipapi.co/json`).subscribe(data => {
              
              this.selfInfo = data;
              if (this.selfInfo.currency === 'BRL') {
                this.selfInfo.currency = 'USD';
              }
              this.selfInfo.flagClass = `flag-icon flag-icon-${this.selfInfo.country.toLowerCase()}`;
              this.currentCountry = this.countries.filter(
                x =>
                  x.code.toLowerCase().trim() ===
                  this.selfInfo.country.toLowerCase().trim()
              )[0];
              this.currentCountry.currency =
                qs.currency || this.currentCountry.currency;
              if (this.selfInfo) {
                const country =
                  countriesList.countries[this.selfInfo.country];
                if (
                  country &&
                  country.languages &&
                  country.languages.length > 0
                ) {
                  this.selfInfo.lang = country.languages[0].toLowerCase();
                }
              }
                this.http
                  .get(`assets/lang/${this.selfInfo.lang}/strings.ini`, {
                    responseType: 'text'
                  })
                  .subscribe(
                    // tslint:disable-next-line:no-shadowed-variable
                    (data: string) => {
                      this.loadData(data);
                    },
                    error => {
                      console.error(error);
                      this.http
                        .get(`assets/lang/en/strings.ini`, {
                          responseType: 'text'
                        })
                        // tslint:disable-next-line:no-shadowed-variable
                        .subscribe((data: string) => {
                          this.loadData(data);
                        });
                    }
                  );
            });
          },
          error => {
            console.error(error);
          }
        );
    });
  }

  ngOnInit() {
    setTimeout(() => {
      let executed = false;
      const kd = event => {
        if (!executed) {
          executed = true;
        } else {
          return;
        }
        // tslint:disable-next-line:prefer-const
        let keyChar = String.fromCharCode(event.keyCode);
        if (event.keyCode === 8) {
          // Backspace
          this.countrySearchText = this.countrySearchText.substr(
            0,
            this.countrySearchText.length - 1
          );
          executed = false;
        } else {
          this.countrySearchText += keyChar;
          this.countrySearchText = this.countrySearchText.toLowerCase();
          const elements = $('.dropdown-menu').find('.dropdown-item');
          const selectedItem = elements
            .filter((x: any) => {
              let tx = $(elements[x])
                .text()
                .toLowerCase();
              tx = tx.substr(tx.indexOf(')') + 1).trim();
              const rv = tx.indexOf(this.countrySearchText) === 0;
              return rv;
            })
            .first();
          selectedItem.focus();
          executed = false;
        }
      };
      $('.dropdown-toggle').bind('keydown', kd);
      $('.dropdown-item').bind('keydown', kd);

      $('#myModal').on('hidden.bs.modal', e => {
        this.dismissModal(false);
      });
    }, 1000);
    setInterval(() => {
      ($('#myModal') as any).modal('handleUpdate');
    }, 1000);
  }

  selectCountry(country) {
    this.currentCountry = country;
    this.countrySearchText = '';
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  loadData(data) {
    this.str = toml.parse(data);

    this.selfInfo.subtitlePath = `./assets/lang/${
      this.selfInfo.lang
    }/subtitles.vtt`;

    this.faqs.length = 0;
    this.faqs.push({
      q: this.str.section7.whatKindOfResultsCanIExpect,
      a: this.str.section7
        .bitcoinTraderMembersTypicallyProfitAMinimumOf1300Daily
    });
    this.faqs.push({
      q: this.str.section7.howManyHoursPerDayDoINeedToWork,
      a: this.str.section7
        .ourMembersWorkAnAverageOf20MinutesADayOrLessBecauseTheSoftwareHandlesTheTradingTheAmountOfworkRequiredIsMinimal
    });
    this.faqs.push({
      q: this.str.section7.whatIsTheMaximumAmountThatICanMake,
      a: this.str.section7
        .yourProfitsAreUnlimitedWithinTheBitcoinTraderSomeMembersEarnedTheirFirstMillionWithinJust61Days
    });
    this.faqs.push({
      q: this.str.section7.howMuchDoesTheSoftwareCost,
      a: this.str.section7
        .membersOfTheBitcoinTraderGetACopyOfOurProprietarySoftwareFreeOfChargeToBecomeAMemberSimplyFillOutTheFormOnThisPage
    });
    this.faqs.push({
      q: this.str.section7.isThisLikeMLMOrAffiliateMarketing,
      a: this.str.section7
        .thisIsNotLikeMLMAffiliateMarketingOrAnythingElseOutThereTheSoftwareIsPoweredByAnInnovativeAlgorithmThatWinsTradesWith994Accuracy
    });
    this.faqs.push({
      q: this.str.section7.areThereAnyFees,
      a: this.str.section7
        .thereAreNoHiddenFeesNoBrokerFeesOrCommissionsAllOfYourMoneyIs100YoursAndYouAreFreeToWithdrawItAtAnyTimeYouChooseWithoutDelay
    });
    this.http
      .get(
        `https://uinames.com/api/?amount=10&region=${this.selfInfo.country_name}&ext`
      )
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(data => {
        this.allPeople = data;
        const countriesTemp = _.shuffle(
          cities.getCities(this.selfInfo.country_name).filter(x => x.length < 15)
        );

        // tslint:disable-next-line:no-shadowed-variable
        _.forEach(data, (person: any, index) => {
          if (person.name.length > 0) {
            this.people.push({
              name: `${person.name} ${person.surname[0].toUpperCase()}.`,
              photo: person.photo,
              region: countriesTemp[index]
            });
            this.people = _.uniqBy(this.people, (v: any) => {
              return `${v.photo}`;
            });
            _.forEach(this.people, e => {
              e.amount = this.randomIntFromInterval(20, 600);
            });
          }
        });

        this.person = this.people[0];

        let index = 0;
        setInterval(() => {
          index++;
          if (index >= this.people.length) {
            index = 0;
          }
          this.person = this.people[index];
        }, 5000);

        // tslint:disable-next-line:max-line-length
        this.people[0].testimonial = this.str.section5.iveBeenAMemberOfTheBitcoinTraderForOnly47DaysButMyLifeHasAlreadyChangedNotOnlyHaveIMadeMyFirst10KButIveAlsoMetSomeOfTheMostIncrediblePeopleInTheProcessThanksBitcoinTrader;
        // tslint:disable-next-line:max-line-length
        this.people[1].testimonial = this.str.section5.iFinallyKnowWhatItsLikeToLiveTheDreamINoLongerFeelLikeImOnTheOutsideLookingInWhileEveryoneElseHasAllTheFunTheBitcoinTraderhasAllowedMeToRetireEarlyAndLiveThe1Lifestyle;
        // tslint:disable-next-line:max-line-length
        this.people[2].testimonial = this.str.section5.surprisinglyIUsedToBeAnInvestorOnWallStreetAndIveNeverSeenAnythingLikeThisInMy10YearTenureAtTheCompanyMyColleaguesAllThoughtIWasCrazyWhenIQuitTheFirmToInvestWithTheBitcoinTraderSoftwareFulltime38459InProfitsLaterAllOfMyColleaguesAreNowBEGGINGMeToLetThemIn;
        // tslint:disable-next-line:max-line-length
        this.people[3].testimonial = this.str.section5.twoWeeksAgoIGotLaidOffWithNoOptionsLeftIThoughtMyLifeWasOverNowImMakingOver126142EachAndEveryDayAndForTheFirstTimeIn2MonthsMyAccountIsntOverdrawnThanksBitcoinTrader;
        const cryptos = Object.keys(crypto);

        const doTrades = () => {
          this.trades = [];
          _.forEach(this.allPeople, person => {
            const a = cryptos[this.randomIntFromInterval(0, cryptos.length - 1)];
            let b = cryptos[this.randomIntFromInterval(0, cryptos.length - 1)];
            while (b === a) {
              b = cryptos[this.randomIntFromInterval(0, cryptos.length - 1)];
            }
            this.trades.push({
              name: `${
                this.allPeople[
                  this.randomIntFromInterval(0, this.allPeople.length - 1)
                ].name
              } ${
                this.allPeople[
                  this.randomIntFromInterval(0, this.allPeople.length - 1)
                ].surname
              }`,
              profit: this.randomIntFromInterval(500, 1500),
              date: moment().format('L'),
              pair: `${a}/${b}`
            });
          });
        };
        setInterval(() => {
          doTrades();
        }, 5000);
        doTrades();
      });
  }

  scrollTop() {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  next() {
    this.formData.isLoading = true;
    this.validate(this.pageNumber).subscribe(
      result => {
        if (result === false) {
          this.onFormError();
        } else {
          this.onFormSuccess();
        }
      },
      e => {
        this.onFormError();
      }
    );
  }

  onFormSuccess() {
    this.pageNumber++;
    this.formData.showDialog = false;
    this.formData.isLoading = false;
  }

  onFormError() {
    this.formData.showDialog = true;
    this.formData.isLoading = false;
    setTimeout(() => {
      $('.validation button')[0].focus();
    }, 10);
  }

  backToPage(page) {
    if (this.pageNumber === 1) {
      if (page === 0) {
        this.pageNumber = 0;
      }
    }
    if (this.pageNumber === 2) {
      if (page === 0 || page === 1) {
        this.pageNumber = page;
      }
    }
  }

  dismissDialog() {
    this.formData.showDialog = false;
  }

  dismissModal(hide = true) {
    this.broker.message = '';
    this.modal.isLoading = false;
    this.modal.show = true;
    this.modal.success = false;
    this.formData.showDialog = false;
    this.formData.isLoading = false;
    if (hide) { ($('#myModal') as any).modal('hide'); }
  }

  validate(page) {
    return new Observable(o => {
      this.formData.validations = [];
      const rv = () => {
        this.formData.validations = _.uniq(this.formData.validations);
        o.next(this.formData.validations.length === 0);
      };

      switch (page) {
        case 0:
          if (
            !this.formData.firstName ||
            this.formData.firstName.trim().length < 2 ||
            (!this.formData.lastName ||
              this.formData.lastName.trim().length < 2)
          ) {
            this.formData.validations.push(
              this.str.form.validation2CharsMinimumNoNumbersOrSpecialCharacters
            );
          }
          console.log(this.broker.id);

          if (
            !this.formData.email ||
            this.formData.email.length < 5 ||
            this.formData.email.indexOf('@') < 0
          ) {
            this.formData.validations.push(
              this.str.form.validationPleaseEnterAValidEmail
            );
            rv();
          } else {
            // http://email.perfectvalidation.com/developers
            this.http
              .get(
                `https://email.perfectvalidation.com/api/validate/${encodeURIComponent(
                  this.formData.email
                )}/`
              )
              .subscribe(
                (info: any) => {
                  if (info && info.Summary) {
                    // you may want to adjust thresholds according to your needs, default is 0.1
                    if (
                      info.Summary.validity > 0.1 &&
                      info.Summary.deliverability > 0.1
                    ) {
                      rv();
                    } else {
                      this.formData.validations.push(
                        this.str.form.validationPleaseEnterAValidEmail
                      );
                      rv();
                    }
                  } else {
                    rv();
                  }
                },
                e => {
                  rv();
                }
              );
          }
          break;
        case 1:
          if (
            !this.formData.password ||
            this.formData.password.trim().length === 0
          ) {
            this.formData.validations.push(
              this.str.form
                .validationOnlyAlphanumericCharactersAllowedPasswordMustBeGreaterThan6CharactersAndContainAtLeast1LetterAnd1Number
            );
          }
          if (!this.regexPassword.test(this.formData.password)) {
            this.formData.validations.push(
              this.str.form
                .validationOnlyAlphanumericCharactersAllowedPasswordMustBeGreaterThan6CharactersAndContainAtLeast1LetterAnd1Number
            );
          }
          if (this.formData.password && this.formData.password.length < 6) {
            this.formData.validations.push(
              this.str.form
                .validationOnlyAlphanumericCharactersAllowedPasswordMustBeGreaterThan6CharactersAndContainAtLeast1LetterAnd1Number
            );
          } else if (this.formData.password !== this.formData.passwordRepeat) {
            this.formData.validations.push(
              this.str.form.validationThePasswordsDoNotMatch
            );
               }
          rv();
          break;
        case 2:
          try {
            const pn = new phoneNumber(
              this.formData.phone,
              this.currentCountry.code
            );
            if (!pn.isValid()) { throw new Error(''); }
          } catch {
            this.formData.validations.push(
              this.str.form.validationPleaseEnterAValidPhone
            );
          }
          rv();
          break;
      }
    });
  }

  submit() {
    this.validate(this.pageNumber).subscribe(
      result => {
        if (result === false) {
          this.onFormError();
        } else {
          this.onFormSuccess();
          this.pageNumber = 2;
          this.formData.isLoading = true;
          this.modal.isLoading = true;
          this.modal.success = false;
          this.modal.show = true;
          ($('#myModal') as any).modal('show');

          const data = {
            affiliateId: this.broker.affiliateId,
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            email: this.formData.email.replace(/\s/g, ''),
            phone: `${
              this.currentCountry.countryCode
            }${this.formData.phone.replace(/\s/g, '')}`,
            country: { code: this.currentCountry.code },
            currency: this.currentCountry.currency,
            // customRefer: this.broker.refer,
            // brokerId: +this.broker.id,
            campaignKeyword: this.broker.campaignKeyword,
            clickId: this.broker.clickId,
            // comment: this.broker.comment,
            externalApiPassword: this.formData.password
          };

          this.brokerService.registerLead(data).subscribe(
            (x: any) => {
              // console.log(x);
                this.broker.logo = x.brokerLogoUrl;
                this.broker.name = x.brokerNameAlias;
              this.localStorage.setItemSubscribe('userId', x.id);
              this.localStorage.getItem('userId').subscribe(id => {
                if (data.clickId) {
                  this.postbackClick(data.clickId);
                }
                if (this.broker.iframeURL) {
                  console.log('this after', this.broker.iframeURL);
                  this.postbackPixel(this.broker.iframeURL);
                }
                this.modal.success = true;
                this.modal.isLoading = false;
              });
            },
            e => {
              this.modal.success = false;
              this.modal.isLoading = false;
              this.broker.message = 'No brokers avalilable.';
              if (e.error && e.error.errors && e.error.errors.length > 0) {
                this.broker.message = e.error.errors.join('<br/>');
              }
              console.error(e);
            }
          );
        }
      },
      e => {
        this.onFormError();
      }
    );
  }

  autologin() {
    this.localStorage.getItem('userId').subscribe(id => {
      if (id) {
        this.brokerService.autologin(id).subscribe((res: any) => {
          window.location.href = res.link;
        });
      }
    });
  }

  postbackPixel(iframeUrl: string) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute(`src`, iframeUrl);
    iframe.setAttribute(`style`, `border:0;`);
    iframe.setAttribute(`width`, `1`);
    iframe.setAttribute(`height`, `1`);

    document.body.appendChild(iframe);
  }

  postbackClick(clickId: string) {
    const img = document.createElement('img');
    img.setAttribute(
      `src`,
      `//track.tracksmarters.com/conversion.gif?cid=` + clickId
    );
    img.setAttribute(`style`, `border:0;`);
    img.setAttribute(`width`, `1`);
    img.setAttribute(`height`, `1`);

    document.body.appendChild(img);
  }
}
